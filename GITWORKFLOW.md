# Git Workflow Documentation

by Evan, Stephen, and Danny

### Description:

This document outlines the process for contributing code to the Cowboy Cards project. All contributions should follow this workflow to ensure code quality, minimize merge conflicts, and maintain a clean project history.

#### 1. Forking the repository

On GitHub, navigate to the Cowboy Cards repository in the organization [HSU-Senior-Project-2025/Cowboy_Cards](https://github.com/HSU-Senior-Project-2025/Cowboy_Cards).

Click the **Fork** button in the top right corner. This will create a copy of the repository in your GitHub account.

#### 2. Cloning the fork

On your fork, click the green **Code** button, then click the method you use to clone repos. Copy the appropriate URL.

On your local machine, open a terminal (Linux or MacOS) or Git Bash (Windows).

Navigate to the directory where you want to store the project.

Run `git clone [URL you copied]` to clone your fork to your local.

#### 3. Add the upstream repo as a remote

To be able to sync with the sprint branch on the upstream repo, you need to add it as a remote with `git remote add upstream https://github.com/HSU-Senior-Project-2025/Cowboy_Cards`. This will add the project repo as a remote called **upstream**. Run `git remote -v` and you should see four lines of output, two for your fork (origin) and two for the project (upstream).

#### 4. Pull the sprint branch to your local

Now run `git pull upstream [name of sprint branch]`. This will update your fork's master branch with the latest commits to the sprint branch.

### Do this early and often, and BEFORE you push any commits.

Run `git branch` and there should be one line of output, **master**.

#### 5. Creating your branch

We use a feature branching strategy. Each new feature, bug fix, or improvement should be developed in its own dedicated branch. This isolates changes and makes it easier to manage pull requests.

To create a new branch, run `git checkout -b [ticket-number/feature]` (replace ticket-number/feature with your own descriptive branch name). Run `git branch` again to see an asterisk next to your new branch, indicating that it is checked out.

#### 6. Develop

Make your code changes in the newly created branch. When you are ready to commit, run the usual commands: `git status`, `git add [files]`, `git commit -am "Descriptive commit message"`. Make as many commits as you need.

#### 7. Stay up-to-date

**_Before_** creating a pull request, it is **_essential_** to integrate the latest changes from the sprint branch of the original repository. This minimizes the risk of merge conflicts. If you have **uncommitted** changes, you can commit them with `git commit` or stash them with `git stash` first. Run `git pull upstream [name of sprint branch]`. To retrieve any stashed changes, run `git stash pop`.

Review the updates and reconcile any differences between them and your code. Use your IDE or a text editor to carefully review the conflicting code and choose the correct changes.

Make another commit if necessary and push your commit(s) up to your remote fork with `git push origin [ticket-number/feature]`.

#### 8. Creating a pull request

On GitHub, navigate to your fork. It will know that you have pushed commits. Click the "Compare & pull request" button.

On the "Open a pull request" page:

- Ensure the "base repository" is **HSU-Senior-Project-2025/Cowboy_Cards** and change the "base branch" to the current sprint branch.

- Ensure the "head repository" is your fork and the "compare branch" is your feature branch.

- Add a clear and descriptive title to your pull request.

- In the description, explain the changes you've made and why. Reference any relevant issues with **#[issue number]**. Teams/teammates can be notified with an **@** followed by the team/member name.

- Click "Create pull request".

#### 9. Code review process

All pull requests will be reviewed by team leads before being merged. Be responsive to feedback and make any necessary changes requested by the reviewers. Comments can be added on a per-line basis and the necessary discussion can take place there until the issue is resolved.

## Note to team leads: Please try to be active and review pull requests often. We don’t have a way to automate merging, so merges will have to be done one at a time to prevent merge conflicts.

#### 10. Merging pull requests

Team leads will be responsible for merging approved pull requests. Squash merging is preferred to keep the commit history clean.

#### 11. Troubleshooting

**Git config**: Check your global git config with `git config --list`. See that you don't have any **pull** options (ff-only, rebase, ff or merge) set; this can make pulling and merging upstream changes difficult.

**Merge conflicts**: Synching with the upstream **regularly** while developing, **_before_** you push anything, will reduce merge conflicts. If you encounter merge conflicts, it doesn't mean anything is wrong, or broken, it just means **git** doesn't know how to reconcile the differences. You have created divergent histories, and **git** wants to converge them. Carefully review the conflicts and resolve them manually in your IDE/editor. Commit the resolved changes.

**Push errors**: If you have trouble pushing your branch, ensure you've updated your local branch with the latest changes from the sprint branch as described above.

This workflow is designed to streamline our development process and minimize integration issues. Please follow these guidelines carefully. If you have any questions, don't hesitate to ask.

Here are a couple of articles:

[Git Merge Conflicts](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)

[How to undo (almost) anything with Git](https://github.blog/open-source/git/how-to-undo-almost-anything-with-git/)
