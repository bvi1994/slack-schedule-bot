var google = require('googleapis');

function checkConflict(user, pending){
  // var newTime = pending.Time ? pending.Time.split(':') : null;
  var startTime = pending.Time ? pending.Time.split(':') : null;
  // var timeNum = parseInt(newTime[0]) + 1; endTime
  var endTime[0] = !("Duration" in pending) ? parseInt(startTime[0]) + 1 : [parseInt(startTime[0]) + Math.floor(pending.Duration)]
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
        'id': 'primary'
      }
    ]
  }

  var calendar = google.calendar('v3');
  var response = calendar.Freebusy.query(check);
  console.log(response.kind);

}

module.exports = {
  checkConflict
};

// dateTime: `${pending['Date']}T${pending.Time}`

// how I added an hour to the Time
// NEWTIME becomes an hour later than the start time
