# Roadmap

This file provides an overview of the direction this project is heading. The roadmap is organized in steps that focus on a specific feature or aspect of the project. Each step is a milestone that should be completed before moving to the next one.

## Step 0: Setup the project and create a simple component that interact with the GitHub API.

### Description

This step is focused on setting up the project and creating a simple component that interacts with the GitHub API. The component will be able to authenticate with GitHub and make requests to the GitHub API.

### Tasks

- [x] Create the project structure
- [x] Setup the project with the necessary dependencies
- [x] Create a simple component that interacts with the GitHub API
- [x] Build typescript files to javascript files

## Step 1: Create a simple script that creates batch issues in a GitHub repository, provided a list of issues in a specific format in a txt file.

### Description

This script will create a new issue in a GitHub repository, using the GitHub API. The script will read a txt file with a list of issues in a specific format and create a new issue for each entry in the file.

### Tasks

- [x] Create a simple script that reads a txt file with a list of issues
- [x] Parse the txt file and extract the information for each issue
- [x] Create a new issue in the GitHub repository for each entry in the txt file

## Step 2: Create a simple script that creates batch issues in a GitHub repository, managing the milestone.

### Description

This script will create a new issue in a GitHub repository, using the GitHub API. The script will read a txt file with a list of issues in a specific format and create a new issue for each entry in the file. The script will also manage the milestone for each issue (it will create a new milestone if it doesn't exist, and assign the issue to the milestone).

### Tasks

- [ ] Define the format for the txt file with the list of issues and milestones
- [ ] Parse the txt file and extract the information for each issue and milestone
- [ ] Create a new milestone in the GitHub repository if it doesn't exist
- [ ] Create and assign the issue to the milestone

## Step 3: Manage existing issues in a GitHub repository.

### Description

This script will manage existing issues in a GitHub repository. If an issue already exists in the repository, the script will update the issue with new information. If the issue doesn't exist, the script will create a new issue.

### Tasks

- [ ] List all the issues in the GitHub repository
- [ ] Update the existing issues with new information
- [ ] Create new issues if they don't exist

## Step 4: Manage multiple formats for the list of issues and multiple file extensions.

### Description

This script will manage multiple formats for the list of issues and multiple file extensions. The script will be able to read different file formats (txt, csv, json, doc, docx, pdf) and extract the information for each issue.

### Tasks

- [ ] Define the different formats for the list of issues
- [ ] Implement the logic to read different file formats (maybe based on font size, font type, spacing, etc.)

## Step 5: Simple web interface

### Description

This step is focused on creating a simple web interface that allows users to interact with the GitHub API. The web interface will provide a form where users can input the repository link, the list of issues, and other information needed to create the issues in the GitHub repository.

### Tasks

- [ ] Create a simple web interface with a form to input the repository link and the list of issues
- [ ] Display the list of new issues and milestones that will be created in the GitHub repository

