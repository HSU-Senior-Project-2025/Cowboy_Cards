# Formatting Standards

by Stephen and Danny

### Description

The purpose of this document is to define formatting standards for the project.

This is advised because you might experience merge conflicts when pulling from the upstream if the following are true:

1. Your formatting differs from upstream
2. You have a divergent history from upstream (you **pushed** something **before** syncing your fork)

It is difficult to prevent merge conflicts entirely when maintaining a fork, but to help decrease the amount of resolving, having consistent formatting between forks is preferable. It should also reduce diff noise, or long diffs that don't show any actual change in functionality, just whitespace changes.

We will be using the **Prettier** extension with most settings at their default values. Here is how to setup VSCode and IntelliJ. The only setting you should have to change is the **single quote** setting to **true**.

## Setup

### Install Prettier

#### VSCode

1. Navigate to extensions.
   - Do `Ctrl+Shift+P` and type `Install Extensions`
   - Select the option `Extensions: Install Extensions`
2. Find Prettier in Extensions
   - Type `Prettier` in the search bar
   - Install the "Prettier - Code formatter" extension by Prettier
3. Configure VSCode settings

   **Option 1: Using GUI**

   1. Open Settings

      - Windows/Linux: File > Preferences > Settings
      - Mac: Code > Preferences > Settings
      - Or use keyboard shortcut: `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)

   2. In the Settings search bar, type `formatter`

      - Find `Editor: Default Formatter`
      - Select `Prettier - Code formatter` from the dropdown

   3. Search for `format on save`

      - Check the box for `"Editor: Format On Save"`

   4. Search for `prettier`
      - Find `Prettier: Tab Width` (you'll have to scroll down about half a page)
      - Set it to `2`
      - Find `Prettier: Print Width`
      - Set it to `80`
      - Find `Prettier: Single Quote`
      - Make sure this is checked.

   **Option 2: Using JSON**

   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
   - Type "settings" and select "Preferences: Open Settings (JSON)"
   - Add or update the following settings:
     ```json
     {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true,
       "prettier.tabWidth": 2,
       "prettier.printWidth": 80,
       "prettier.singleQuote": true
     }
     ```

#### IntelliJ IDEA

> IntelliJ does not apply these settings globally. Make sure you redo these steps if you create a new IntelliJ project.

1. Ensure the Prettier package is installed
   - You should already have Node.js. If you don't, download it [here.](https://nodejs.org/en#download)
   - Open your terminal (use GitBash on Windows)
   - Run:
   ```bash
   npm install --global prettier
   ```
2. Install Prettier plugin

   - Go to Settings (`Ctrl+Alt+S` or `Cmd+,` on Mac)
   - Navigate to Plugins
   - Search for `Prettier`
   - Install the `Prettier` plugin
   - Restart IntelliJ when prompted

3. Set Prettier plugin settings

   - Go to Settings
   - Navigate to Languages & Frameworks > JavaScript > Prettier (expand the dropdown)
   - Select the option `Automatic Prettier configuration`
   - Set the options under that:
     - Run for files: `{**/*,*}.{js,ts,jsx,tsx,css,scss,json,html,vue}`
     - Make sure `Run on save` is checked

4. Create a Prettier configuration file
   - Create a `.prettierrc` file in your project/fork root
   - Add the following:
     ```json
     {
       "tabWidth": 2,
       "printWidth": 80,
       "singleQuote": true
     }
     ```
   - Add this file to your `.gitignore`
     - Find the `.gitignore` file in your root directory
     - Add `.prettierrc` under the `# Editor directories and files" section`
5. Set auto-formatting
   - Go to Settings
   - Navigate to Tools > Actions on Save
   - Check `Reformat code`

#### Test Setup

To verify your setup works:

1. Open one of the Typescript files in the project
2. Add a blank line somewhere
3. Save the file
4. The file should format on save to the exact state it was in when you opened it

#### Troubleshooting

- Restarting your editor can fix some issues
- If you're using IntelliJ, you must have the Prettier installed globally on your machine
- If you're using IntelliJ, double-check your settings after you reopen your project/fork. The settings detailed in this guide do not apply to all projects
- Refer to these docs for other issues:

  https://www.jetbrains.com/help/idea/prettier.html#ws_prettier_reformat_code
  https://www.jetbrains.com/help/idea/configuring-project-and-ide-settings.html
  https://prettier.io/docs/configuration  
  https://prettier.io/docs/install  
  https://www.freecodecamp.org/news/how-to-use-prettier-in-visual-studio-code/

- Let us know on Teams if you have any issues
