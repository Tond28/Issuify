import fs from "fs"
import "dotenv/config"
import { GithubApiComponent } from "./components/githubApiComponent"

const LINK = process.env.REPOSITORY_LINK
const OWNER = LINK.split("/")[3]
const REPO = LINK.split("/")[4]

let withMilestones = fs.existsSync("./data/milestones.txt")
let rawMilestones: string[] = []
if (withMilestones) {
  rawMilestones = fs.readFileSync("./data/milestones.txt", "utf8").split("\n")
}

const rawIssues = fs.readFileSync("./data/issues.txt", "utf8")

const githubComponent = new GithubApiComponent({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY
})

async function main() {

  //ATTENTION: This script is not finished and the final version will not be a script but a server
  //This script is just a draft to test the Github API and the different functionalities


  // milestones
  const inputMilestones = rawMilestones.map((milestone) => {
    const [code, title] = milestone.split(" = ")
    return {
      code,
      title
    }
  })

  const rawExistingMilestones = await githubComponent.listMilestones({
    owner: OWNER,
    repo: REPO
  })

  const milestones = rawExistingMilestones.data.map((milestone) => (
    {
      title: milestone.title,
      number: milestone.number,
      code: milestone.title.split("( ")[1].split(" )")[0]
    }
  ))

  for (const milestone of inputMilestones) {
    const existingMilestone = milestones.find((m) => m.code === milestone.code)
    if (!existingMilestone) {
      const newMilestone = await githubComponent.createMilestone({
        owner: OWNER,
        repo: REPO,
        title: milestone.title,
        code: milestone.code
      })
      milestones.push({
        title: newMilestone.data.title,
        number: newMilestone.data.number,
        code: milestone.code
      })
    }
  }


  // issues
  const splitted = rawIssues.split(/\n{4,}/)
  const issues = splitted.reduce((acc: {title: string, body: string, milestoneNumber?: number}[], issue) => {
    const [title, ...body] = issue.split("\n")

    let milestoneNumber = undefined
    for( const milestone of milestones) {
      if (title.split("-")[0].match(new RegExp("^" + milestone.code + "\\d* ?$"))) {
        console.log(title)
        milestoneNumber = milestone.number
        break
      }
    }

    if (title !== "") {
      acc.push({
        title,
        body: body.join("\n"),
        milestoneNumber
      })
    }
    return acc
  }, [])

  for (const issue of issues) {
    await githubComponent.createIssue({
      owner: OWNER,
      repo: REPO,
      title: issue.title,
      body: issue.body,
      milestoneNumber: issue.milestoneNumber
    })
  }
}

main()