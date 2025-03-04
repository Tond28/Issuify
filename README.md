# Issuify 🚀

Issuify simplifies issue creation by allowing you to convert a plain text list of future GitHub issues into actual issues on your repository. No more manual entry—just write your list, run Issuify, and let it do the work for you!

# Features
✅ Convert a simple text list into GitHub issues
✅ Save time by automating issue creation
✅ Easy to use, no complex setup required

Perfect for project planning, backlog grooming, and quickly adding multiple issues without hassle.

## Setup
Before using Issuify, ensure you have:

- **Node.js** installed on your machine.
- **A GitHub App** with an **Application ID** and **Private Key**.

To create a GitHub App:
1. Go to **GitHub → Settings → Developer settings → GitHub Apps**.
2. Click **New GitHub App** and configure it.
3. Generate and download the private key.
4. Note the Application ID.

Then, create a `.env` file in the root directory of the project and add the following variables:

```env
GITHUB_APP_ID=your_github_app_id
REPOSITORY_LINK=https://api.github.com/repos/username/repo-name  # Replace with your actual GitHub username and repository name
GITHUB_APP_PRIVATE_KEY=your_github_app_private_key
```

## Usage

Issuify expects your issue list to follow this structure:

```
First line: Title  
Other lines: Body (empty lines are allowed, empty lines between title and body are removed)  
3 empty lines separate each issue  
```

For example:
```
Feature: Add dark mode
Users should be able to switch to dark mode from settings.




Bug: Fix login issue
Some users cannot log in after the latest update.
```
See the [example](data-example/issues.txt) for more details.

The list of issues should be in a file named `issues.txt` in the `data/` directory.

To run the script, use the following command:

```bash
npm start
```

## Contributing
Want to contribute? You can:
- Create a pull request with your changes.
- Open an issue for suggestions or bug reports.
- Help with a task from the [ROADMAP](ROADMAP.md).

