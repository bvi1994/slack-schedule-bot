var google = require('googleapis');
var { endTimeFn, endDateFn } = require('./calculateDuration');
var calendar = google.calendar('v3');
var OAuth2 = google.auth.OAuth2;
var scope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

function getAuthClient() {
  return new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    //'http://localhost:3000/google/callback'
    process.env.DOMAIN + '/google/callback'
  );
}

module.exports = {
  generateAuthUrl(Name) {
    return getAuthClient().generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope,
      state: Name
    });
  },

  getToken(code) {
    var client = getAuthClient();
    return new Promise(function(resolve, reject) {
      client.getToken(code, function (err, tokens) {
        if (err)  {
          reject(err);
        } else {
          resolve(tokens);
        }
      });
    });
  },

  checkTokens(user){
    // console.log('Checktokens is running')
    if(Date.now() > user.Google.tokens.expiry_date){
      var client = getAuthClient();
      client.setCredentials(user.Google.tokens);
      client.refreshAccessToken(function(err, tokens) {
        if(err){
          console.log(err)
          return err + ' Unable to update token'
        }
        // console.log("Updating user's token");
        user.Google.tokens = tokens;
        return user.save();
      })
    }

    // console.log("Look here: " + user.Google.tokens.expiry_date);
    return new Promise(function(resolve, reject){
      resolve(user);
    });
  },


  createCalendarEvent(tokens, pendingObj) {
    var client = getAuthClient();
    client.setCredentials(tokens);
    var endTime;
    var endDate;
    if (pendingObj.Invitees){
        endTime = endTimeFn(pendingObj.Time, pendingObj.Duration);
        endDate = endDateFn(pendingObj['Date']);
    }
    console.log('end time: ', endTime);
    console.log('end date: ', endDate);
    var resourceObj = pendingObj.Invitees ?
      {summary: `meeting`,
       description: pendingObj.Subject ? `re: ${pendingObj.Subject}` : null,
       location: pendingObj.Location || null,
       start: { dateTime: `${pendingObj['Date']}T${pendingObj.Time}`, 'timeZone': 'America/Los_Angeles' },
       end: { dateTime: `${endDate}T${endTime}`, 'timeZone': 'America/Los_Angeles' }
      }
    : {summary: pendingObj.Subject,
       start: { date: pendingObj['Date'], 'timeZone': 'America/Los_Angeles' },
        end: { date: pendingObj['Date'], 'timeZone': 'America/Los_Angeles' }
      }
    return new Promise(function(resolve, reject) {
      calendar.events.insert({
        auth: client,
        calendarId: 'primary',
        resource: resourceObj
      }, function(err, res) {
        if (err)  {
          reject(err);
        } else {
          resolve(tokens);
        }
      });
    });
  }
};
