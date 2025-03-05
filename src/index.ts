import fs from "fs"
import "dotenv/config"
import { GithubApiComponent } from "./components/githubApiComponent"

const LINK = process.env.REPOSITORY_LINK
const OWNER = LINK.split("/")[3]
const REPO = LINK.split("/")[4]

const rawIssues = fs.readFileSync("./data/issues.txt", "utf8")

const githubComponent = new GithubApiComponent({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY
})

async function main() {

  const splitted = rawIssues.split(/\n{4,}/)
  const issues = splitted.reduce((acc: {title: string, body: string}[], issue) => {
    const [title, ...body] = issue.split("\n")
    if (title !== "") {
      acc.push({
        title,
        body: body.join("\n")
      })
    }
    return acc
  }, [])
  for (const issue of issues) {
    await githubComponent.createIssue({
      owner: OWNER,
      repo: REPO,
      title: issue.title,
      body: issue.body
    })
  }
}

main()