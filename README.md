# Noteful API

## General Description
This Express server accesses a database, serving as the API for the Noteful note-taking React app. 

## Technology used
Express, PostgreSQL, Morgan, Helmet. 

## Contact me
You can find [my GitHub page here](https://github.com/sam1cutler).

## Acknowledgements
This project is part of an assignment for the Thinkful software engineering program. 




## Notes on usage / construction

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies with `npm i`
5. Move the example Environment file to `.env` (that will be ignored by git and read by the express server) with `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application: `npm start`

Start nodemon for the application: `npm run dev`

Run the tests: `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's main branch.