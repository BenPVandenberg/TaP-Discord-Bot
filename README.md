# Custom Discord Bot
  First attempt at a discord bot, it runs on an AWS EC2 Service.

  To connect with .pem key run `ssh -i "AWS_BOT_KEY.pem" ubuntu@ec2-3-16-203-154.us-east-2.compute.amazonaws.com`

# Format

  The code in the index.js shouldn't need to be changed much (if at all) as it's very dynamic.
  To add a command simply add a new .js file to the commands folder, make sure to follow the format of existing files.

# AWS Interaction

  ## How to start/stop the service

    1. Connect to the service through ssh
    2. Run "cd tp_bot/Custom-Discord-Bot/"
    3. From here run "npm start/stop" respectively

  ## How to git pull

    Due to the repo being private "git pull" itself isn't enough
    Follow the steps 1 & 2 on the prev section and run "./git_pull"

# Security

  Due to security purposes we are using dotenv to keep our login tokens off the repo if we ever want to make it public.
  To get your copy of the .pem key and .env file please message Rollin#3406 on discord
