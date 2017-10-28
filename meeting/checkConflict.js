var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var calculateDuration = require('../calculateDuration');

function getAuthClient() {
  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    //'http://localhost:3000/google/callback'
    process.env.DOMAIN + '/google/callback'
  );
}


function checkConflict(user, pending){
  // var newTime = pending.Time ? pending.Time.split(':') : null;
  var client = getAuthClient();
  var tokens = user.Google.tokens;
  client.setCredentials(tokens);
  var startDate = pending.Time ? pending.Time.split(':') : null;
  var startTime = new Date(pending['Date'] + 'T' + startDate.join(':'));
  // console.log('Duration', calculateDuration.convertDuration(pending.Duration));
  var endTime = new Date(pending['Date'] + 'T' + startDate.join(':'));
  var duration = calculateDuration.convertDuration(pending.Duration) || 3600000;
  console.log(duration);
  endTime.setTime(endTime.getTime() + duration);
  // console.log(startTime);
  // console.log(endTime);

  var check = {
    'auth': client,
    'resource': {
      'timeMin': startTime,
      'timeMax': endTime,
      'timeZone': 'America/Los_Angeles',
      'items': [
        {
          'id': 'primary',
          'busy': 'active'
        }
      ]
    }
  }

  var calendar = google.calendar('v3');
  console.log('Start Time:', startTime);
  console.log('End Time:', endTime);
  return new Promise(function(resolve,reject){
    calendar.freebusy.query(check, function(error, schedule){
      if(error){
        console.log('Error: ', error);
        reject(error);
      } else {
        console.log('Schedule ', schedule.calendars.primary.busy)
        if(schedule.calendars.primary.busy.length){
          console.log("Meeting conflict");
          resolve(false);
        }
        else{
          console.log("No Conflict")
          resolve(true);
        }
      }
    });
  });
}


// module.exports = {
//   checkConflict
// };

module.exports = {
  checkConflict
}
