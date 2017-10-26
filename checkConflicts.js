function checkConflict(user, pending){

}

module.exports = {
  checkConflict
};

// dateTime: `${pending['Date']}T${pending.Time}`

// how I added an hour to the Time
// var newTime = pending.Time ? pending.Time.split(':') : null;
// var timeNum = parseInt(newTime[0]) + 1;
// newTime[0] = timeNum >= 10 ? timeNum.toString() : `0${timeNum.toString()}`;
// newTime = newTime.join(':');
// NEWTIME becomes an hour later than the start time
