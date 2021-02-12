# pull the base image
FROM node:alpine

# set the working direction
WORKDIR /app

# install app dependencies
COPY package.json ./

RUN npm install

# add app
COPY . .

# build app
RUN ["npm","run", "build"]

FROM nginx
EXPOSE 80
COPY --from=0 /app/build /usr/share/nginx/html