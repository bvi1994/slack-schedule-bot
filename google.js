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
    var changeDate = false;
    if (pendingObj.Invitees){
        endTime = pendingObj.Time ? pendingObj.Time.split(':') : null;
        switch(pendingObj.Duration.unit) {
            case 'm':
                if ((parseInt(endTime[1]) + pendingObj.Duration.amount) < 60) {
                      endTime[1] = parseInt(endTime[1]) + pendingObj.Duration.amount
                }
                else {
                    endTime[0] = parseInt(endTime[0]) + 1;
                    endTime[1] = parseInt(endTime[1]) + pendingObj.Duration.amount - 60
                }
                endTime = endTime.join(':');
                break;
            case 'h':
                if ((parseInt(endTime[0]) + pendingObj.Duration.amount) < 24){
                    endTime[0] = parseInt(endTime[0]) + pendingObj.Duration.amount;
                } else {
                    endTime[0] = parseInt(endTime[0]) + pendingObj.Duration.amount - 24;
                    changeDate = true;
                }
                endTime = endTime.join(':');
                break;
            default:
                if (parseInt(endTime[1]) + 30 < 60){
                    endTime[1] = parseInt(endTime[1]) + 30;
                } else {
                    endTime[0] = parseInt(endTime[0]) + 1;
                    endTime[1] = parseInt(endTime[1]) - 30;
                }
                endTime = endTime.join(':');
        }
        if (changeDate){
            endDate = pendingObj['Date'].split('-');
            endDate[2] = parseInt(endDate[2]) + 1;
            endDate = endDate.join('-');
        } else {
            endDate = pendingObj['Date'];
        }
        console.log('got through new stuff')
    }
    var resourceObj = pendingObj.Invitees ?
      {summary: `meeting}`,
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
