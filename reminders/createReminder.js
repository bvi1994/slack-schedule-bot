var { Reminder } = require('../models/models');

function createReminder(subject,date,channel){
  var newDate = new Date(date);
  return new Reminder({
    Subject: subject,
    Date: newDate,
    Channel: channel
  }).save();
};

module.exports = {
  createReminder
};
