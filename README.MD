# A simple Slack todo list app

This app is meant to walk through how to create a simple app using many of the features of the Slack API in a straightforward way. The app keeps dependencies to a minimum and tries to reduce complexity to keeping all of the business logic in a single file. As you will see, this isn't necessarily the most straightforward organization for an app of even modest complexity.

The app is broken down into multiple steps, each with its own branch. The `main` branch is the fully working, complete app.

## Step 0

1. Set up your app at [api.slack.com/apps](https://api.slack.com/apps). Create a new app and choose "From an app manifest".
2. Copy the manifest at `manifest.yaml`
3. Install the app on to your workspace
4. Generate an app-level token for Socket Mode
5. Name the token “TodoSocketMode” and request `connections:write`
6. Initialize the bolt project

```
npm init
npm install @slack/bolt
npm install dotenv
```
7. Create a `.env` file and add the following:

```
SLACK_APP_TOKEN=xapp...
SLACK_BOT_TOKEN=xoxb...
```

Copy the appropriate values from the app config page from when you created your app at api.slack.com/apps
