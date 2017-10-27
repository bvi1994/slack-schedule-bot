var google = require('../google');
var { createReminder } = require('../reminders/createReminder');

function askForCalendarAccess(user){
  return new Promise((resolve, reject) => {
    if(!user){
      reject('Cannot request calendar access for undefined user');
    }
    else if(!user.Name){
      reject('user.Name undefined');
    }
    else if(!process.env.DOMAIN){
      reject('Missing process.env.DOMAIN');
    }
    else {
      resolve(`Hey. I'm a scheduler bot. I need permission to access your calendar application. Please give me permission to hack to your Google Calender. ${process.env.DOMAIN}/setup?Name=${user.Name}`);
    }
  });
};

function cancelIntent(user, intent){
  user.Pending = null;
  return user.save()
  .then(function(){
    return `${intent} not added.`;
  })
  .catch(function(err){
    console.log('Error canceling intent:', err);
  })
};

function handleReminderIntent(user){
  return google.checkTokens(user)
  .then(function(){
    return google.createCalendarEvent(user.Google.tokens, user.Pending);
  })
  .then(function(){
    return createReminder(user);
  })
  .then(function(){
    user.Pending = null;
    return user.save();
  })
  .then(function(){
    return `Reminder added.`;
  })
  .catch(function(err){
    console.log("Error creating reminder:", err);
  });
};

function handleMeetingIntent(user){
  return planMeeting(user)
  .then(function(){
    user.Pending = null;
    return user.save();
  })
  .then(function(){
    return `Reminder added.`;
  })
  .catch(function(err){
    console.log("Error creating reminder:", err);
  });
};

module.exports = {
  askForCalendarAccess,
  cancelIntent,
  handleReminderIntent,
  handleMeetingIntent
};
