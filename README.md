# Serverless Trello Todo

![Serverless badge](http://public.serverless.com/badges/v3.svg)
![MIT License badge](https://img.shields.io/github/license/Savjee/trello-todo)
![Build status badge](https://github.com/Savjee/trello-todo/workflows/Node%20CI/badge.svg)
![Open issues](https://img.shields.io/github/issues/Savjee/trello-todo)

Node.js script that automatically moves Trello cards to the "Soon" list when they are due within the next 7 days. Moves cards to "Today" list when they are due today.

![](https://savjee.github.io/trello-todo/trello-screenshot.jpg)

## Config
Everything is configurable with a `.env` file, see the [.env.dist](https://github.com/Savjee/trello-todo/blob/master/src/.env.dist) file as an example.

Also check the `serverless.yml` file as this contains the configuration for deploying to AWS Lambda.

## Deploying it to AWS
This is a [Serverless](https://serverless.com) application that runs every hour to check your Trello cards and move them if necessary.

Make sure you have the Serverless framework installed:
```
npm install -g serverless
```

Clone this repository & install dependencies
```
git clone https://github.com/Savjee/trello-todo.git
cd trello-todo
npm install
```

Change the `.env` file and fill in your Trello API key & list id's.
```
# Trello API credentials
API_KEY = ''
API_TOKEN = ''

# The ID of the Trello board that should be processed
BOARD_ID = ''

# The list that contains your backlog cards
BACKLOG_LIST_ID = ''

# List that should contain cards due within the next 7 days
SOON_LIST_ID = ''

# List that should contain cards due today
TODAY_LIST_ID = ''
```

Deploy it to AWS:
```
sls deploy
```

This will automatically create the Lambda function and will schedule it to run every hour (CloudWatch)

## Run locally
If you want to test it locally, use:
```
npm run local
```

## Contribute
I'm always open for suggestions. Feel free to open issue's or pull requests.