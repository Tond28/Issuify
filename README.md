# Auto Issue

This is a simple script that creates a new issue in a GitHub repository. It uses the GitHub API to create the issue.

## Setup

To use this script, you need to have a GitHub application: application ID, private key. You can create a GitHub application in the GitHub settings.

Then you have to create a `.env` file in the root directory of the project and add the following variables:

```env
GITHUB_APP_ID= # GitHub application ID

REPOSITORY_LINK= # https://api.github.com/repos/username/repo-name (replace username and repo-name with your GitHub username and repository name where you want to create the issues)

GITHUB_APP_PRIVATE_KEY = # GitHub application private key
```

## Usage

Assuming that the standard template of your issues is:

```
First line: Title
Other lines: Body (empty lines are allowed, empty lines between title and body are removed)
3 empty lines between issues
```

```
Title 1
Body 1




Title 2

Body 2
```
See the [example](data-example/issues.txt) for more details.

The list of issues should be in a file named `issues.txt` in the `data/` directory.

To run the script, use the following command:

```bash
npm start
```

## Contributing

If you want to contribute to this project, you can create a pull request with your changes. You can also contribute by opening an issue with suggestions or bug reports or managing a task from the [ROADMAP](ROADMAP.md).

