var { Reminder } = require('../models/models');

function createReminder(user){
  var subject = user.Pending.Subject ? user.Pending.Subject : 'Meeting';
  var date = user.Pending.Date;
  var userId = user.Name;
  var newDate = new Date(date);
  return new Reminder({
    Subject: subject,
    Date: newDate,
    UserId: userId
  }).save();
};

module.exports = {
  createReminder
};
