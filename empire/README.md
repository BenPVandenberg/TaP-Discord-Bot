# Custom Discord Bot

First attempt at a discord bot. It is a bot make for a private server of friends.

## Run Instructions

Refer to the README.md in the root of the repository.

## Development

### Repo Structure

The repo is structured for easy future expansion

- The code in the index.ts shouldn't need to be changed much (if at all), it's main job is to
  route an incoming event to the correct listener.
- To add a new command, add a .ts file to the commands folder that follows the structure of
  the other commands.
- The events folder is where all the discord event listeners are stored.
- The utilities folder is where any functions that are used by multiple commands are stored.
- Configuration Storage
  - `config.json`: This file contains configuration for the nature of the bot.
  - `.env`: This file contains variables that give the bot access to external resources.

### Environment

Recommended that you use VS code for development with the extentions recommended by
the `.vscode\extensions.json` file.

### Submitting new code

- Test any new code before pushing it to the repo.
- Make a new branch for new features and make a pull request to the master branch.
- (Optional) Add a Github issue/feature request and assign it to yourself before
  starting work.
