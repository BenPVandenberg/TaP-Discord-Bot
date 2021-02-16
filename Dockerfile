# pull the base image
FROM node:14.15.5-alpine3.10

# set the working direction
WORKDIR /app

# install app dependencies
COPY package.json ./

RUN npm install

# add app
COPY . .

# build app
RUN npm run build

RUN npm i -g serve
# RUN serve -s build

# build with "docker build -t benpv/bot-frontend:latest ."
