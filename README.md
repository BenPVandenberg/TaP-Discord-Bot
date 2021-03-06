# T&P-Discord-Bot

[![Netlify Status](https://api.netlify.com/api/v1/badges/6dc605e9-9e20-4ec9-bad2-f36ce8f1079b/deploy-status)](https://app.netlify.com/sites/tandp/deploys)

## Structure

| Codebase |     Description |
| :------- | --------------: |
| Envy     |  React frontend |
| gala     | express backend |
| opal     |           mySQL |

## How to run locally

### Envy

1. Run ```npm install``` + ```npm start```

### Gala

1. Create a .env file following the example
2. Crate an SSL certificate with ```openssl req -nodes -new -x509 -keyout server.key -out server.cert```
3. Run ```npm install``` + ```npm start```
