const {
  Bot,
  webhookCallback,
  Keyboard,
  MemorySessionStorage,
} = require('grammy');

// const { Telegraf } = require("telegraf");
// const { message } = require("telegraf/filters");

const { chatMembers } = require('@grammyjs/chat-members');

// import { chatMembers } from "@grammyjs/chat-members";

const BOT_TOKEN = process.env.TG_BOT_TOKEN;

const web_link = 'https://taskmosaic.com/' + BOT_TOKEN + '/webhook';
const web_app_url = 'https://taskmosaic.com/app';

// const bot = new Telegraf(BOT_TOKEN);
// bot.start((ctx) => ctx.reply("Welcome"));
// bot.help((ctx) => ctx.reply("Send me a sticker"));
// bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
// bot.hears("hi", (ctx) => ctx.reply("Hey there"));
// bot.launch();

// // Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

// const reply_url = "https://api.telegram.org/bot" + BOT_TOKEN;

const bot = new Bot(BOT_TOKEN);

const adapter = new MemorySessionStorage();
bot.use(chatMembers(adapter));

// // 2. Reply to text messages with the received text
// bot.on("message:text", (ctx) => ctx.reply(ctx.message.text));

// // 3. Start the bot
// bot.start();

// const bot = new Bot(BOT_TOKEN, {
//   client: {
//     // We accept the drawback of webhook replies for typing status.
//     canUseWebhookReply: (method) => method === "sendChatAction",
//   },
//   botInfo: {
//     id: 6781477012,
//     is_bot: true,
//     first_name: "TaskMosaic | Task Manager",
//     username: "taskmosaic_bot",
//     can_join_groups: true,
//     can_read_all_group_messages: true,
//     supports_inline_queries: false,
//   },
// });

// bot.api.setWebhook(
//   "https://taskmosaic.com/6781477012:AAHkAjA--S0k9TvlaTQMYSGU4RA1OOXSNvU/webhook"
// );

const keyboard = new Keyboard()
  .text('🔍??? Мой KZTRVL аккаунт')
  .row()
  .text('😎 Настройка')
  .text('⭐️ Помощь')
  .resized();

// await bot.api.setMyCommands([
//   { command: "start", description: "Start the bot" },
//   { command: "help", description: "Show help text" },
//   { command: "settings", description: "Open settings" },
// ]);

// const keyboard = new Keyboard([
//   // [Button.text("text")],
//   // [Button.requestContact("text")],
//   // [Button.requestLocation("text")],
//   // [Button.requestPoll("text", "quiz")],
//   [MenuButtonWebApp.url("web app", web_app_url)],
// ]);

bot.command('start', async (ctx) => {
  initGroup(ctx)
    .then(async (res) => {
      // Send the menu:
      return await ctx.reply(
        `Hey!\n <b>Be Better. Be Productive. Be Wealthy</b> \n by TaskMosaic`,

        { parse_mode: 'HTML', reply_markup: keyboard }
      );
    })
    .catch(async (err) => {
      return await ctx.reply('Error: ' + err, {
        reply_to_message_id: ctx.message?.message_id,
      });
    });
});

bot.command('task', async (ctx) => {
  if (!ctx.from?.username) return;
  // if (!ctx.message?.reply_to_message?.message_id) {
  //   return await ctx.reply(
  //     "Please reply to a message or add a message in the next line.",
  //     {
  //       reply_to_message_id: ctx.message?.message_id,
  //     }
  //   );
  // }
  //

  let replyMessage = ctx.message?.reply_to_message?.text;

  //

  // member is fetching. It is youself
  // const chatMember = await ctx.chatMembers.getChatMember();

  // ! TODO: ADD BOT TO GROUP AND VERIFY IF USER IS A MEMBER OF THE GROUP. USED IN ASSIGNING TASKS TO USERS
  // let chatId = ctx.chat?.id;
  // let userToDemo;

  // userToDemo = ctx.message.text.match(/@\w+/)[0];
  // const chatMember = await ctx.chatMembers.getChatMember(chatId, userToDemo);

  // return ctx.reply(
  //   `Hello, ${chatMember.user.first_name}! I see you are a ${chatMember.status} of this chat!`
  // );

  //

  // '/task 24.12 to-do @username task_description' => ['24.12', 'to-do', '@username', 'task_description']
  const args = ctx.message.text.split(' ').slice(1);

  //  assign the task to the user
  if (ctx.message.text.split(' ').length === 1) {
    // return await ctx.reply("task will be assigned to the yourself", {
    //   reply_to_message_id: ctx.message?.message_id,
    // });

    // !! TODO: assign the task to the user as reply to the message and as a new message

    let taskIs = ctx.message?.reply_to_message?.text;
    let user = ctx.from.first_name;

    createTaskForReply(ctx)
      .then(async (res) => {
        return await ctx.reply(
          `Task: ${taskIs}\nStatus: to-do \nAuthor: ${user}`,
          {
            reply_to_message_id: ctx.message?.message_id,
          }
        );
      })
      .catch(async (err) => {
        return await ctx.reply('Error: ' + err, {
          reply_to_message_id: ctx.message?.message_id,
        });
      });
  }

  let message = ctx.message.text;
  // remove the first argument from the message. '/task 24.12 to-do @username task_description' => 'to-do @username task_description'
  message = message.split(' ').slice(1).join(' ');
  // trim the message
  message = message.trim();

  let date;
  let dateFound = false;

  // validate if string provided is . or / DD.MM with DD with 1 to 31 and MM with 1 to  12
  let dateItem;
  if (args[0].includes('.') || args[0].includes('/')) {
    //   date = null;
    //   dateFound = false;
    //   return ctx.reply("no  'DD.MM'");
    // } else {
    // split string by . or / using regex

    dateArray = args[0].split(/[./]/);

    let day = dateArray[0];
    let month = dateArray[1];

    if (day && month) {
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        date = args[0];
        dateFound = true;
      } else {
        return ctx.reply("<b>Error.</b>\n Use 'DD.MM'", {
          parse_mode: 'HTML',
        });
      }
    }
  }
  // else if it is a string with numbers only. Detect that separator is missing
  else if (args[0].match(/\d+/)) {
    return ctx.reply("<b>Error.</b>\n Use 'DD.MM'", {
      parse_mode: 'HTML',
    });
  }

  let status;
  let statusDB;
  let statusFound = false;
  let possibleStatus = {
    'to-do': ['to-do', 'todo', 'td', 'ToDO', 'To-Do', 'ToDO', 'TODO'],
    'in-progress': ['in-progress', 'inprogress', 'ip', 'In-Progress'],
    'in-review': ['in-review', 'inreview', 'ir', 'In-Review'],
    done: ['done', 'dn', 'Done', 'DONE'],
  };
  // let possibleStatus = {
  //   "to-do": ["to-do", "todo", "td", "ToDO", "To-DO"],
  //   "in-progress": [
  //     "in-progress",
  //     "inprogress",
  //     "ip",
  //     "In-Progress",
  //     "In-Progress",
  //   ],
  //   "in-review": ["in-review", "inreview", "ir", "In-Review", "In-Review"],
  //   done: ["done", "dn", "Done", "DONE"],
  // };

  let statusItem;
  if (dateFound == true) {
    statusItem = args[1];
  } else {
    statusItem = args[0];
  }

  // validate if status found as in possibleStatus object value
  for (let key in possibleStatus) {
    if (possibleStatus[key].includes(statusItem)) {
      //
      status = statusItem;
      statusDB = key;
      statusFound = true;
      break;
    }
  }

  // let user = ctx.from.username;
  let user = ctx.from.first_name;

  let userTo;
  let userToFound = false;

  // if message contains @username @ at the beginning of the word
  if (message.includes('@')) {
    userTo = message.match(/@\w+/)[0];
    if (userTo) {
      userToFound = true;
    }
    //
  } else {
    userToFound = false;
    userTo = null;
  }

  if (replyMessage) {
    // send the task to the user
    //
    return await ctx.reply(
      `Task: ${replyMessage}\nDate: ${date}\nStatus: ${status}\nFor: ${userTo}\nStatusDb: ${statusDB}\nAuthor: ${user}`
    );
  } else {
    //
    // task description is the rest of the message after date, status and @username if found in any order
    let taskDescription;
    let taskDescriptionFound = false;
    //

    if (dateFound && statusFound && userToFound) {
      taskDescription = message
        .replace(date, '')
        .replace(status, '')
        .replace(userTo, '');
      taskDescriptionFound = true;

      // trim the task description
      //
      taskDescription = taskDescription.trim();

      // remove the first argument from the message
      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (dateFound && statusFound) {
      taskDescription = message.replace(date, '').replace(status, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (dateFound && userToFound) {
      taskDescription = message.replace(date, '').replace(userTo, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (statusFound && userToFound) {
      taskDescription = message.replace(status, '').replace(userTo, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (dateFound) {
      taskDescription = message.replace(date, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (statusFound) {
      taskDescription = message.replace(status, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else if (userToFound) {
      taskDescription = message.replace(userTo, '');
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    } else {
      taskDescription = message;
      taskDescriptionFound = true;
      taskDescription = taskDescription.trim();

      // taskDescription = taskDescription.split(" ").slice(1).join(" ");
    }

    if (taskDescription == '' || taskDescription == null) {
      return await ctx.reply('<b>Error.</b>\n No task!', {
        parse_mode: 'HTML',
      });
    }
    //
    // ! TODO: save the task to the database

    // send the task to the user
    return await ctx.reply(
      `Task: ${taskDescription}\nDate: ${date}\nStatus: ${status}\nFor: ${userTo}\nStatusDb: ${statusDB}\nAuthor: ${user}`
    );
  }
});

bot.hears('🔍??? Мой KZTRVL аккаунт', async (ctx) => {
  await ctx.reply(`Ваш ID:` + ctx.from.id);
});

bot.hears('😎 Настройка', async (ctx) => {
  await ctx.reply(
    'Укажите ваш ID на KZTRVL.  Начинается с @ и указан в профиле на сайте'
  );
});

bot.hears('⭐️ Помощь', async (ctx) => {
  return await ctx.reply(
    `${ctx.message.from.username},\nесли нужна поддержка, пиши в канал @kztrvI`
  );
});

bot.start({
  //
  // Make sure to specify the desired update types
  allowed_updates: ['chat_member', 'message'],
});

function createTaskForReply(ctx) {
  return new Promise((resolve, reject) => {
    let taskIs = ctx.message?.reply_to_message?.text;
    let user = ctx.from.first_name;
    let username = ctx.from.username;
    let chatId = ctx.chat?.id;
    let time = new Date();

    const Task = Parse.Object.extend('Task');
    const task = new Task();
    task.set('task', taskIs);
    task.set('author', user);
    task.set('authorUsername', username);
    task.set('chatId', chatId);
    task.set('timeStamp', time);
    task.set('status', 'to-do');

    task.save(null, { useMasterKey: true }).then(
      (gameScore) => {
        resolve('done');
      },
      (error) => {
        reject('error');
      }
    );
  });
}

function initGroup(ctx) {
  return new Promise(async (resolve, reject) => {
    let groupName = ctx.chat?.title;
    let chatId = ctx.chat?.id;
    let chatType = ctx.chat?.type;
    let chatUsername = ctx.chat?.username;
    let chatInviteLink = ctx.chat?.invite_link;
    let chatMembersCount = ctx.chat?.members_count;
    let chatPinnedMessage = ctx.chat?.pinned_message;
    let chat = ctx.chat;

    // let sender_chat = ctx.prototype.getChat(chatId);
    let chat_obj = await ctx.api.getChat(chatId);

    let chatDescription = chat_obj?.description;
    let chatBigPhoto = chat_obj?.photo.big_file_id;
    let chatSmallPhoto = chat_obj?.photo.small_file_id;

    let bigPhotoFile = await ctx.api.getFile(chatBigPhoto);
    let smallPhotoFile = await ctx.api.getFile(chatSmallPhoto);

    const bigPhoto = await bigPhotoFile.getUrl();
    const smallPhoto = await smallPhotoFile.getUrl();

    // let sender_chat_obj = JSON.stringify(sender_chat);
    // let photo = sender_chat_obj?.photo;
    // let message_chat = ctx.message.chat;

    // let getChatAdministrators = await ctx.getChatAdministrators(chatId);

    let user = ctx.from.first_name;
    let userId = ctx.from.id;
    let userUsername = ctx.from.username;
    let userLanguage = ctx.from.language_code;
    let userIsBot = ctx.from.is_bot;

    const Group = Parse.Object.extend('Group');
    const group = new Group();
    group.set('groupName', groupName);
    group.set('chatId', chatId);
    group.set('chatType', chatType);
    group.set('chatUsername', chatUsername);
    group.set('chatDescription', chatDescription);
    group.set('chatInviteLink', chatInviteLink);
    group.set('chatMembersCount', chatMembersCount);
    group.set('chatPhoto', chatPhoto);
    group.set('chatPinnedMessage', chatPinnedMessage);
    group.set('user', user);
    group.set('userId', userId);
    group.set('userUsername', userUsername);
    group.set('userLanguage', userLanguage);
    group.set('userIsBot', userIsBot);
    group.set('chat', chat);

    group.set('sender_chat', sender_chat);
    group.set('bigPhoto', bigPhoto);
    group.set('smallPhoto', smallPhoto);

    // group.set("message_chat", message_chat);
    // group.set("sender_chat_obj", sender_chat_obj);
    // group.set("getChatAdministrators", getChatAdministrators);

    // group.set("photo", photo);

    group.save(null, { useMasterKey: true }).then(
      (gameScore) => {
        resolve('done');
      },
      (error) => {
        reject('error');
      }
    );
  });
}

// console.log("bot");
// bot.start();

// app.use(webhookCallback(bot, "express"));

// app.get(
//   "/6781477012:AAHkAjA--S0k9TvlaTQMYSGU4RA1OOXSNvU/webhook",
//   webhookCallback(bot, "express")
// );

// const handleUpdate = webhookCallback(bot, "std/http");
// const handleUpdate = webhookCallback(bot, "https");
// const handleUpdate = webhookCallback(bot, "express");

// app.post(
//   "/6781477012:AAHkAjA--S0k9TvlaTQMYSGU4RA1OOXSNvU/webhook",
//   webhookCallback(bot, "express")
// );

// app.get("/" + BOT_TOKEN, async (req, res) => {

// app.post(
//   "/6781477012:AAHkAjA--S0k9TvlaTQMYSGU4RA1OOXSNvU/webhook",
//   async (req, res) => {
//     // app.post("/" + BOT_TOKEN, async (req, res) => {
//     console.log("bot token");
//     // const message = JSON.parse(req.body);
//     // return bot.handleUpdate(message, res);
//     // return webhookCallback(bot, "express");
//     // return webhookCallback(bot, "http");
//     // return app.use(webhookCallback(bot, "express"));
// try {
//   await handleUpdate(req);
//   //       // webhookCallback(bot, "express");
//   //       return webhookCallback(bot, "express");
//   //       // app.use(webhookCallback(bot, "express"));
//   //       // app.use(webhookCallback(bot, "express"));
// } catch (e) {
//   console.log(e);
// }
//     // var body = req.body;
//     // req.post(reply_url + "/sendMessage", {
//     //   form: {
//     //     chat_id: body.message.chat.id,
//     //     text: "POST REPLY SUCCESS",
//     //     reply_to_message_id: body.message.message_id,
//     //   },
//     // });
//     // return await webhookCallback(bot, "express");
//     // works fine, but no user
//     // const user = req?.user;
//     // let responseText = "Hello World! DONE!<br>";
//     // responseText += `<small>Response by function: ${user}</small>`;
//     // res.send(responseText);
//     //--------------------------------
//     // // // class created and data saved, but with no user
//     // Parse.Cloud.run("demoTGRun")
//     //   .then((item) => {
//     //     let itemJSON = JSON.stringify(item);
//     //     let responseText = "Hello World! DONE!<br>";
//     //     responseText += `<small>Response by function: ${itemJSON}</small>`;
//     //     res.send(responseText);
//     //   })
//     //   .catch((error) => {
//     //     let responseText = `ERROR! ` + error + `<br>`;
//     //     responseText += `<small>Requested at: ${req.requestTime}</small>`;
//     //     res.send(responseText);
//     //   });
//     //--------------------------------
//     // // class created and data saved, but with no user
//     // const GameScore = Parse.Object.extend("AGameScore");
//     // const gameScore = new GameScore();
//     // gameScore.set("score", 1337);
//     // gameScore.set("playerName", "Sean Plott");
//     // gameScore.set("cheatMode", false);
//     // gameScore.save(null, { useMasterKey: true }).then(
//     //   (gameScore) => {
//     //     let responseText = "Hello World! DONE!<br>";
//     //     responseText += `<small>Requested by user: ${req.user}</small>`;
//     //     res.send(responseText);
//     //   },
//     //   (error) => {
//     //     let responseText = `ERROR! ` + error + `<br>`;
//     //     responseText += `<small>Requested at: ${req.requestTime}</small>`;
//     //     res.send(responseText);
//     //   }
//     // );
//   }
// );
