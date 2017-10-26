var { Reminder } = require('../models/models');
var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);

function sendReminder(reminder){
  var todaysDate = new Date();
  todaysDate.setHours(0,0,0,0);
  var today = reminder.Date.getTime() === todaysDate.getTime();
  var message;
  var remove = true;
  if(reminder.Channel === 'test'){
    message = `Reminding ${reminder.Channel} to ${reminder.Subject} ${today ? 'today' : 'tomorrow'}`;
  }
  else{
    message = `Reminder to ${reminder.Subject} ${today ? 'today' : 'tomorrow'}`;
    try{
      web.chat.postMessage(reminder.Channel, message);
      console.log(message);
    } catch(error){
      remove = false;
    }
  }
  if(today && remove){
    console.log(`Reminder ${reminder._id} removed from database.`);
    return reminder.remove();
  }
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

module.exports = {
  sendReminder
};
