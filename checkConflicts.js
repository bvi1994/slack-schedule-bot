var google = require('googleapis');

function checkConflict(user, pending){
  // var newTime = pending.Time ? pending.Time.split(':') : null;
  var startTime = pending.Time ? pending.Time.split(':') : null;
  // var timeNum = parseInt(newTime[0]) + 1; endTime
  var endTime = startTime;
  endTime[0] = !("Duration" in pending) ? (parseInt(startTime[0]) + 1) : (parseInt(startTime[0]) + Math.floor(pending.Duration));
  var addedMinutes = (pending.Duration - Math.floor(pending.Duration)) * 60
  if(startTime[1] + addedMinutes > 60){
    endTime[0] = (parseInt(startTime[0]) + 1) % 24;
    endTime[1] = parseInt(startTime[1]) + addedMinutes - 60
  }
  endTime[0] = endTime[0] >= 10 ? endTime[0].toString() : `0${endTime[0].toString()}`;
  endTime[1] = endTime[1] >= 10 ? endTime[1].toString() : `0${endTime[1].toString()}`;
  endTime = endTime.join(':');

  var dateTimeStart = `${pending['Date']}T${pending.Time}`
  var dateTimeEnd = `${pending['Date']}T${endTime}`

  var check = {
    'timeMin': dateTimeStart,
    'timeMax': dateTimeEnd,
    'timeZone': 'America/Los_Angeles',
    'items': [
      {
        'id': 'primary',
        'busy': 'active'
      }
    ]
  }

  var calendar = google.calendar('v3');
  var response = calendar.freebusy.query(check);
  console.log(response.kind);

}

module.exports = {
  checkConflict
};

var testUser = {"_id": {
    "$oid": "59f24131cb2783001222fd56"
    },
    "Name": "U7NHW121Z",
    "Channel": "D7NK86NN5",
    "Pending": {
        "Time": "19:00:00",
        "Subject": "",
        "Location": "",
        "Invitees": [
            "Google in the face"
        ],
        "Duration": "",
        "Date": "2017-10-26"
    },
    "Google": {
        "isSetupComplete": true,
        "tokens": {
            "refresh_token": "1/zUxNoBEWsEyLwRisfspW7sIxYJ6S59KLb0D1xImO_S0",
            "expiry_date": 1509062283308,
            "token_type": "Bearer",
            "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjZjkwYTVlNjRjNzFkM2E3Njc0MDk4NGIwMGFiZDkzM2ZhZjllMDQifQ.eyJhenAiOiIxMDY0NjI0ODc1MzgxLWxxMGsxOXRsYmMybXRoYWp0YmU4bTM4MWxhN3FiYzA0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA2NDYyNDg3NTM4MS1scTBrMTl0bGJjMm10aGFqdGJlOG0zODFsYTdxYmMwNC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNTMwOTIyMjA4MDc1MDc1OTk2NSIsImF0X2hhc2giOiJrZEo5OHp0RVYwcGVQSGJ0a1E4VWRBIiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTA1ODY4MywiZXhwIjoxNTA5MDYyMjgzfQ.JICbk9YodGcJ0pcRQZKgP6eH1QSc_a9QiTH_Ub0qQfGM_Nf6MYxAoJ9BAjlvV45C9s5L1ouB4X_iiaHsxWxB-uv0MBiAjPHKXyo34PDwh6J05U9M-yHQSyF_oQl_JQpE_fQ3sGBXg_JNCBDog4GvoEz1CpU3HMva9VK8otiI-2aFQxt64fGdWkaY-7nIRoGqRGGp6v4tlaBeEoMUs51JyDHLBCKI7oQFyKBBHdEV0cG7KWbNjyY7NXMREE44_0kctte9L-7-_NkYRKSxO432-keprsLMsaU3c6JdtIIbESM_ha12sYxqhoQa0N49Urx6ei-V2RqEBBFZbfikcgo4Yg",
            "access_token": "ya29.GlvwBEWwCtwKY9ivatI3Zt8grp3vzQwlrEzYIiIAlhsOv-r79ccAiYE8MfS8oLASk1i8UGUxj6cHCsePB0V-cUUbXxGD3x1Fhxn0bNNvVndpWWtlCbQdyt3f6Y-w"
        }
    },
    "__v": 0}

var testPending = {"Time": "19:00:00",
  "Subject": "",
  "Location": "",
  "Invitees": [
      "Google in the face"
  ],
  "Duration": "",
  "Date": "2017-10-26"}

checkConflict(testUser, testPending);

// dateTime: `${pending['Date']}T${pending.Time}`

// how I added an hour to the Time
// NEWTIME becomes an hour later than the start time
