import { RestEndpointMethodTypes } from "@octokit/rest"
import { GithubApiComponent } from "./githubApiComponent"
import { injectable, inject } from "tsyringe"

type Issue = RestEndpointMethodTypes["issues"]["get"]["response"]["data"]

export enum ISSUE_STRATEGY {
  CREATE = "CREATE", // create all issue, also if already exists
  CREATE_NEW = "CREATE_NEW", // create only new issues
  CREATE_UPDATE = "CREATE_UPDATE", // create new issues and update existing
  SYNC = "SYNC" // create new issues, update existing and close removed
}

type InsertIssue = {
  title: string
  body: string
  milestoneNumber?: number
}

type UpdateIssue = {
  title: string
  body: string
  number: number
  milestoneNumber?: number
}

type DeleteIssue = {
  number: number
}

@injectable()
export class IssuesComponent {

  constructor(
    @inject(GithubApiComponent)
    private githubComponent: GithubApiComponent
  ) {}

  public createIssues = async ({
    auth,
    rawIssues,
    strategy
  }: {
    auth: { owner: string, repo: string },
    rawIssues: InsertIssue[],
    strategy: ISSUE_STRATEGY
  }) => {
    let createIssue: InsertIssue[] = []
    let updateIssue: UpdateIssue[] = []
    let deleteIssue: DeleteIssue[] = []

    switch (strategy) {
    case ISSUE_STRATEGY.CREATE: {
      createIssue = rawIssues
      break
    }
    case ISSUE_STRATEGY.CREATE_NEW: {
      const existingIssues = await this.githubComponent.listIssues(auth)
      const existingTitle = existingIssues.map((issue) => issue.title)
      createIssue = rawIssues.filter(
        (issue) =>
          !existingTitle.includes(issue.title)
      )
      break
    }
    case ISSUE_STRATEGY.CREATE_UPDATE: {
      const out = await this.checkInsertUpdate({
        auth: auth,
        newIssues: rawIssues
      })
      createIssue = out.issuesToCreate
      updateIssue = out.issuesToUpdate
      break
    }
    case ISSUE_STRATEGY.SYNC: {
      const out = await this.syncIssuesList({
        auth: auth,
        newIssues: rawIssues
      })
      createIssue = out.issuesToCreate
      updateIssue = out.issuesToUpdate
      deleteIssue = out.issuesToDelete
      break
    }
    }

    // following command cannot be parallelized, because of the rate limit
    for (const issue of createIssue) {
      await this.githubComponent.createIssue({
        owner: auth.owner,
        repo: auth.repo,
        title: issue.title,
        body: issue.body,
        milestoneNumber: issue.milestoneNumber
      })
    }

    for (const issue of updateIssue) {
      await this.githubComponent.updateIssue({
        owner: auth.owner,
        repo: auth.repo,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        milestoneNumber: issue.milestoneNumber
      })
    }

    for (const issue of deleteIssue) {
      await this.githubComponent.closeIssue({
        owner: auth.owner,
        repo: auth.repo,
        issueNumber: issue.number
      })
    }
  }

  private syncIssuesList = async ({
    newIssues,
    auth
  }: {
    newIssues: InsertIssue[],
    auth: { owner: string, repo: string }
  }) => {
    const existingIssue = await this.githubComponent.listIssues(auth)

    const newIssueTitles = newIssues.reduce((acc, issue) => {
      acc[issue.title] = issue
      return acc
    }, {} as Record<string, InsertIssue>)
    const issuesToCreate = newIssues.filter(
      (issue) => !existingIssue.find((i) => i.title === issue.title)
    )

    const issuesToUpdate = existingIssue.reduce((acc, issue) => {
      const newIssue = newIssueTitles[issue.title]
      if (newIssue) {
        if (
          issue.body !== newIssue.body ||
          issue.milestone?.number !== newIssue.milestoneNumber
        ) {
          acc.push({
            title: newIssue.title,
            body: newIssue.body,
            number: issue.number,
            milestoneNumber: newIssue.milestoneNumber
          })
        }
      }
      return acc
    }, [] as UpdateIssue[])


    const newIssueTitlesKeys = Object.keys(newIssueTitles)
    const issuesToDelete = existingIssue.reduce((acc, issue) => {
      if (!newIssueTitlesKeys.includes(issue.title)) {
        acc.push({
          number: issue.number
        })
      }
      return acc
    }, [] as DeleteIssue[])
    return { issuesToCreate, issuesToUpdate, issuesToDelete }

  }

  private checkInsertUpdate = async ({
    newIssues,
    auth
  }: {
    newIssues: InsertIssue[],
    auth: { owner: string, repo: string }
  }): Promise<{
    issuesToCreate: InsertIssue[]
    issuesToUpdate: UpdateIssue[]
  }> => {
    const existingIssues = await this.githubComponent.listIssues(auth)
    const existingIssueTitles = existingIssues.reduce((acc, issue) => {
      acc[issue.title] = issue
      return acc
    }, {} as Record<string, Issue>)
    const newIssueTitles = newIssues.reduce((acc, issue) => {
      acc[issue.title] = issue
      return acc
    }, {} as Record<string, InsertIssue>)

    const issuesToCreate = newIssues.filter(
      (issue) => !existingIssueTitles[issue.title]
    )
    const issuesToUpdate = existingIssues.reduce((acc, issue) => {
      const newIssue = newIssueTitles[issue.title]
      if (newIssue) {
        if (
          issue.body !== newIssue.body ||
          issue.milestone?.number !== newIssue.milestoneNumber
        ) {
          acc.push({
            title: newIssue.title,
            body: newIssue.body,
            number: issue.number,
            milestoneNumber: newIssue.milestoneNumber
          })
        }
      }
      return acc
    }, [] as UpdateIssue[])
    
    return { issuesToCreate, issuesToUpdate }
  }

}