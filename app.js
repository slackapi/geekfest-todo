// use the values stored in .env
require('dotenv').config();
import { Sequelize, Model, DataTypes } from 'sequelize';

const { App } = require('@slack/bolt');

// set up the data model
const sequelize = new Sequelize('sqlite::memory:');
const Todo = sequelize.define('Todo', {
  todo: DataTypes.STRING,
  due: DataTypes.DATE,
});

//intialize the Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();
