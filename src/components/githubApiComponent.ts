import { App } from "@octokit/app"
import { RequestError } from "octokit"
import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"
import { AuthInterface } from "node_modules/@octokit/auth-app/dist-types/types"
import { Cache, CacheContainer } from "node-ts-cache"
import { MemoryStorage } from "node-ts-cache-storage-memory"
import  ExtendedError, { ERROR_CODES }  from "../utils/ExtendedError"

const cache = new CacheContainer(new MemoryStorage())

const jsonCalculateKey = (data: {
  className?: string
  methodName: string
  args: unknown[]
}) => {
  return `${<string>data.methodName}:${JSON.stringify(
      data.args
  )}`
}

export class GithubApiComponent {
  private appId: string
  private privateKey: string
  private auth: AuthInterface
  private app: App

  constructor({ appId, privateKey }: { appId: string, privateKey: string }) {
    this.appId = appId
    this.privateKey = privateKey

    this.auth = createAppAuth({
      appId: this.appId,
      privateKey: this.privateKey
    })
    this.app = new App({
      appId: this.appId,
      privateKey: this.privateKey,
      authStrategy: this.auth
    })
  }

  private getInstallationToken = async (installationId: number) => {
    return this.auth({
      type: "installation",
      installationId,
    })
  }

  private _withOctokit = async <T>(
    { owner, repo } : { owner: string, repo: string },
    callback: (octokit: Octokit) => Promise<T>
  ): Promise<T> => {
    let token;
    try {
      const installation = await this.getInstallationId({ owner, repo })
      if (installation.status !== 200) {
        throw new ExtendedError(ERROR_CODES.GITHUB_APP_NOT_INSTALLED, "Installation ID not found")
      }
      token = (await this.getInstallationToken(installation.installationId)).token
    } catch (error) {
      throw this._manageError(error, { status: 403, extra: {owner, repo} })
    }
    try {
      const octokit = new Octokit({ auth: token })
      return await callback(octokit)
    } catch (error) {
      throw this._manageError(error)
    }
  }

  private _manageError = (error: unknown, options? : { status?: number, extra?: unknown }): ExtendedError=> {
    console.log(error)
    if (options?.status === 403) {
      cache.setItem(jsonCalculateKey({
        className: GithubApiComponent.name,
        methodName: this.getInstallationId.name,
        args: [options.extra]
      }

      ), undefined, {ttl: 1})
    }
    if (error instanceof RequestError) {
      throw new ExtendedError(ERROR_CODES.GITHUB_ERROR, error.message)
    }
    throw new ExtendedError(ERROR_CODES.INTERNAL_SERVER_ERROR, "Internal server error")
  }

  async createIssue({
    owner,
    repo,
    title,
    body,
  }: {
    owner: string
    repo: string
    title: string
    body?: string
  }) {
    return this._withOctokit({ owner, repo }, (octokit) =>
      octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        title,
        body,
      })
    )
  }

  async listIssues({
    owner,
    repo,
  }: {
    owner: string
    repo: string
  }) {
    return await this._withOctokit({ owner, repo }, async (octokit) =>
      await octokit.paginate("GET /repos/{owner}/{repo}/issues", {
        owner,
        repo
      })
    )
  }

  async closeIssue({
    owner,
    repo,
    issue_number,
  }: {
    owner: string
    repo: string
    issue_number: number
  }) {
    return this._withOctokit({ owner, repo }, async (octokit) =>
      await octokit.issues.update({
        owner,
        repo,
        issue_number,
        state: "closed",
      })
    )
  }

  async listMilestones({
    owner,
    repo,
  }: {
    owner: string
    repo: string
  }) {
    return await this._withOctokit({ owner, repo }, (octokit) =>
      octokit.request("GET /repos/{owner}/{repo}/milestones", { owner, repo })
    )
  }

  async createMilestone({
    owner,
    repo,
    title,
    code,
  }: {
    owner: string
    repo: string
    title: string
    code: string
  }) {
    return this._withOctokit({ owner, repo }, (octokit) =>
      octokit.request("POST /repos/{owner}/{repo}/milestones", {
        owner,
        repo,
        title: `${title}(${code})`,
      })
    )
  }

  @Cache(cache, { ttl: 60 * 60 * 24, calculateKey: jsonCalculateKey })
  async getInstallationId({
    owner,
    repo,
  }: {
    owner: string
    repo: string
  }) {
    const response = await this.app.octokit.request("GET /repos/{owner}/{repo}/installation", {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (response.data.id) {
      return {
        status: 200,
        message: "Installation ID found",
        installationId: response.data.id,
      }
    } else {
      throw new ExtendedError(ERROR_CODES.GITHUB_APP_NOT_INSTALLED, "Installation ID not found")
    }
  }
}