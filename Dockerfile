# pull the base image
FROM node:latest

# set the working direction
WORKDIR /app

# install app dependencies
COPY package.json ./

RUN npm install --​quiet

# add app
COPY . .

# build with "docker build -t benpv/discord-bot:latest ."
