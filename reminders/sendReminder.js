var { Reminder } = require('../models/models');
var { findChannel } = require('./findChannel');
var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);

function sendReminder(reminder){
  if(reminder.UserId === 'test'){
    return sendTestReminder(reminder);
  }
  return sendRealReminder(reminder);
};

function sendTestReminder(reminder){
  var todaysDate = new Date();
  todaysDate.setHours(0,0,0,0);
  var message = `Reminding ${reminder.UserId} to ${reminder.Subject} ${today ? 'today' : 'tomorrow'}`;
  var today = reminder.Date.getTime() === todaysDate.getTime();
  if(today){
    console.log(`Reminder ${reminder._id} removed from database.`);
    return reminder.remove();
  }
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

function sendRealReminder(reminder){
  var todaysDate = new Date();
  todaysDate.setHours(0,0,0,0);
  var today = reminder.Date.getTime() === todaysDate.getTime();
  var message = `Reminder to ${reminder.Subject} ${today ? 'today' : 'tomorrow'}`;
  findChannel(reminder.UserId)
  .then(function(channel){
    return web.chat.postMessage(channel, message);
  })
  .then(function(){
    console.log(message);
    if(today){
      console.log(`Reminder ${reminder._id} removed from database.`);
      return reminder.remove();
    }
    return new Promise(function(resolve, reject) {
      resolve();
    });
  })
  .catch(function(err){
    return new Promise(function(resolve, reject) {
      resolve();
    });
  });
};

module.exports = {
  sendReminder
};
