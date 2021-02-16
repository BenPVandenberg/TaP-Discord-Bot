FROM node:latest

WORKDIR /app

COPY .. .
RUN npm install

EXPOSE 5000

# CMD ["npm", "start"]

# build with "docker build -t benpv/bot-backend:latest ."