var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

function getAuthClient() {
  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    //'http://localhost:3000/google/callback'
    process.env.DOMAIN + '/google/callback'
  );
}


async function checkConflict(user, pending){
  // var newTime = pending.Time ? pending.Time.split(':') : null;
  var client = getAuthClient();
  var tokens = user.Google.tokens;
  client.setCredentials(tokens)
  var startDate = pending.Time ? pending.Time.split(':') : null;
  var startTime = new Date(pending.Date + 'T' + startDate.join(':'));
  // console.log(pending.Duration);
  var endTime = new Date(pending.Date + 'T' + startDate.join(':'));
  var duration = 3600000 // TO_DO: Calculate millseconds for arbitary duration. See Google.js
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
  calendar.freebusy.query(check, function(error, schedule){
    if(error){
      console.log('Error: ', error);
      return error
    } else {
      console.log('Schedule ', schedule.calendars.primary.busy)
      if(schedule.calenders.primary.busy){
        return false
      }
      return true
    }
  })

}



module.exports = {
  checkConflict
};
