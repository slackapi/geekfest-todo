// use the values stored in .env
require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');

const { App } = require('@slack/bolt');

//intialize the Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// set up the data model
const sequelize = new Sequelize('sqlite::memory:');

class Todo extends Model {}
Todo.init({
  todo: DataTypes.STRING,
  due: DataTypes.DATE,
}, { sequelize, modelName: 'todo' });

// HANDLE THE APP INTERACTIONS
//
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
        callback_id: "todo_view",
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
            block_id: "todo_input",
            element: {
              type: "plain_text_input",
              action_id: "todo-text"
            },
            label: {
              type: "plain_text",
              text: "What do you want to do?",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: "todo_due_input",
            element: {
              type: "datepicker",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true
              },
              action_id: "todo-datepicker"
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

  // Get the specific values from the submitted view
  const todo_description = view['state']['values']['todo_input']['todo-text']['value'];
  const todo_due = view['state']['values']['todo_due_input']['todo-datepicker']['selected_date'];

  console.log(todo_description);
  console.log(todo_due);

  // Create a new todo in the database
  (async () => {
    await sequelize.sync();
    const new_todo = await Todo.create({
      todo: todo_description,
      due: todo_due,
    });
    console.log(new_todo.toJSON());
  })();
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();
