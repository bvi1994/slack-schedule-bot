var { Reminder } = require('../models/models');

function createReminder(subject,date,name){
  var newDate = new Date(date);
  return new Reminder({
    Subject: subject,
    Date: newDate,
    Name: name
  }).save();
};

module.exports = {
  createReminder
};
