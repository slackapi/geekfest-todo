// use the values stored in .env
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const { App } = require('@slack/bolt');

//intialize the Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// set up the data model
const sequelize = new Sequelize('sqlite::memory:');
const Todo = sequelize.define('Todo', {
  todo: DataTypes.STRING,
  due: DataTypes.DATE,
});

// Respond to the shortcut to create a modal for defining the todo
app.shortcut('new_todo', async ({ shortcut, ack, client, logger }) => {
  try {
    // Acknowledge shortcut request
    await ack();

    // Call the views.open method to create a modal
    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: "modal",
        callback_id: 'todo_view',
        title: {
          type: "plain_text",
          text: "New Todo"
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true
        },
        close: {
          type: "plain_text",
          text: "Close"
        },
        blocks: [
          {
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action"
            },
            label: {
              type: "plain_text",
              text: "What do you want to do?",
              emoji: true
            }
          },
          {
            type: "input",
            element: {
              type: "datepicker",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true
              },
              action_id: "datepicker-action"
            },
            label: {
              type: "plain_text",
              text: "When do you want to do it?",
              emoji: true
            }
          }
        ]
      }
    });

    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

// Handle the todo_view submission
app.view('todo_view', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack();

  console.log("todo view");

  logger.info(view['state']['values']);

  // Assume there's an input block with `block_1` as the block_id and `input_a`
  // const val = view['state']['values']['block_1']['input_a'];
  // const user = body['user']['id'];


});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();
