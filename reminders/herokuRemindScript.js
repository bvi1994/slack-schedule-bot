var { Reminder } = require('../models/models');
var { sendReminder } = require('./sendReminder');

Reminder.findUpcoming()
.then(function(reminders){
  return Promise.all(reminders.map((reminder)=>(
    sendReminder(reminder)
  )));
})
.catch(function(err){
  console.log("Error:",err);
});
