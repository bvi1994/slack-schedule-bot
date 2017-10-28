var google = require('../google');
var { createReminder } = require('../reminders/createReminder');

function scheduleMeeting(invitee, pending) {
  return google.checkTokens(invitee)
  .then(function(){
    return google.createCalendarEvent(invitee.Google.tokens, pending);
  })
  .then(function(){
    return createReminder(invitee);
  })
  .catch(function(err){
    console.log(`Error scheduling meeting for ${invitee.Name}:`, err);
  });
};

module.exports = {
  scheduleMeeting
}
