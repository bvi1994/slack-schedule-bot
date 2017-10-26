var google = require('googleapis');
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
        console.log("Updating user's token");
        user.Google.tokens = tokens;
        return user.save();
      })
    }

    console.log("Look here: " + user.Google.tokens.expiry_date);
    return new Promise(function(resolve, reject){
      resolve(user);
    });
  },


  createCalendarEvent(tokens, pendingObj) {
    var client = getAuthClient();
    client.setCredentials(tokens);
    var newTime = pendingObj.Time.split(':');
    var timeNum = parseInt(newTime[0]) + 1;
    newTime[0] = timeNum >= 10 ? timeNum.toString() : `0${timeNum.toString()}`;
    newTime = newTime.join(':');
    var resourceObj = pendingObj.Invitees ?
      {summary: 'meeting',
       description: `with ${pendingObj.Invitees.map((invitee) => invitee).join()}`,
       location: pendingObj.Location || null,
       start: { dateTime: `${pendingObj['Date']}T${pendingObj.Time}`, 'timeZone': 'America/Los_Angeles' },
       end: { dateTime: `${pendingObj['Date']}T${newTime}`, 'timeZone': 'America/Los_Angeles' }
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
