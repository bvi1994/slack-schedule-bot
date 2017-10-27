var { Reminder } = require('../models/models');
var { sendReminder} = require('./sendReminder');
var { data } = require('./dummyReminders');
function populateReminders(){
  return Promise.all(data.map((reminder)=>(
    new Reminder(reminder).save()
  )))
  .then(function(){
    console.log('Reminders added to database.');
  })
  .catch(function(err){
    console.log("Error:",err);
  })
};

function clearReminders(searchQuery){
  Reminder.find(searchQuery).remove()
  .then(function(){
    console.log("Cleared Reminders");
  })
  .catch(function(err){
    console.log("Error:",err);
  })
}

var testQuery = {
  UserId: 'test'
};

// Code to test reminder logic locally with dummy data on Mlab
populateReminders()
.then(function(){
  return Reminder.findUpcoming();
})
.then(function(reminders){
  console.log("Upcoming Reminders Found:",reminders);
  return Promise.all(reminders.map((reminder)=>(
    sendReminder(reminder)
  )));
})
.then(function(){
  console.log('Reminders sent and database updated!');
  clearReminders(testQuery);
})
.catch(function(err){
  console.log("Error:",err);
});
