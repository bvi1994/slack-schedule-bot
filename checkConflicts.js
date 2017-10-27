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


function checkConflict(user, pending){
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
  return calendar.freebusy.query(check, function(error, schedule){
    if(error){
      console.log('Error: ', error);
      return error
    } else {
      console.log('Schedule ', schedule.calendars.primary.busy)
      if(schedule.calendars.primary.busy.length){
        console.log("Meeting conflict");
        return false
      }
      console.log("Meeting scheduled")
      return true
    }
  })
}



module.exports = {
  checkConflict
};

var testUser = {
    "_id": {
        "$oid": "59f374c27a5b5000120e45de"
    },
    "Name": "U7NHW121Z",
    "Channel": "D7NK86NN5",
    "Pending": {
        "Time": "16:00:00",
        "Subject": "dinner",
        "Location": "",
        "Invitees": [
            "emma"
        ],
        "Duration": "",
        "Date": "2017-10-27"
    },
    "Google": {
        "isSetupComplete": true,
        "tokens": {
            "expiry_date": 1509131028632,
            "token_type": "Bearer",
            "refresh_token": "1/sErIFgUKnM1oUJ9HixHDRltaM7LeID0e7So4A7lewUY",
            "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjZjkwYTVlNjRjNzFkM2E3Njc0MDk4NGIwMGFiZDkzM2ZhZjllMDQifQ.eyJhenAiOiIxMDY0NjI0ODc1MzgxLWxxMGsxOXRsYmMybXRoYWp0YmU4bTM4MWxhN3FiYzA0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA2NDYyNDg3NTM4MS1scTBrMTl0bGJjMm10aGFqdGJlOG0zODFsYTdxYmMwNC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNTMwOTIyMjA4MDc1MDc1OTk2NSIsImF0X2hhc2giOiIwTmV1TDNmLUFkTmlXQzk0enZ4eHZnIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTEyNzQyOCwiZXhwIjoxNTA5MTMxMDI4fQ.zrJRWZH8_4HTzc1ZV1m8vCwwjD-MFiY3mdPIiPLDap5VTaLaNDT4YFLeRaOSinT0AOOsZx58xNz-BvJzsQMoDIKDZCdVqdAeVlbwnXEhP3u7g3vnOigbh22R-PWMfB0t9ZuC2fcMI-Ji1Asq25lMf7JoPSGpJ5tbTYZnho2lRGREplItrC3JL8ItRs6W8gnmuan03HYuNYC4cj1vawJRHxeB5Clre76PYdWzN6FqdJKqhYW44k14E-PIc_UEOFJhUaPX6_V-TQn5_5wdI2frH4lnYqh9yf-nAe0ApCWEIFZwetf35Bxb5OL4Qo0UnHH_3xu8609oF2YPTtvVSJV_FA",
            "access_token": "ya29.GlvxBFvrh3zpqP-AASM6RUfCgN2BNGP9oqoTt9J4rG_4tUlzcKRTetBp4ydcmpRJ3ZEhSxfbEx3sfM3f5V_i-ygPdFmXRbfq3hHYKOjYXE7IFi0JfPKGBYXxn0DO"
        }
    },
    "__v": 0
}

var testPending = {
    "Time": "16:00:00",
    "Subject": "dinner",
    "Location": "",
    "Invitees": [
        "emma"
    ],
    "Duration": "",
    "Date": "2017-10-27"
}

checkConflict(testUser, testPending);
