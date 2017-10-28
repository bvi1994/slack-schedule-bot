var changeDate;
function endTimeFn(time, duration){
    var endTime;
    changeDate = false;
    endTime = time ? time.split(':') : null;
    switch(duration.unit) {
        case 'm':
            if ((parseInt(endTime[1]) + duration.amount) < 60) {
                  endTime[1] = parseInt(endTime[1]) + duration.amount
            }
            else {
                endTime[0] = parseInt(endTime[0]) + 1;
                endTime[1] = parseInt(endTime[1]) + duration.amount - 60
            }
            endTime = endTime.join(':');
            break;
        case 'h':
            if ((parseInt(endTime[0]) + duration.amount) < 24){
                endTime[0] = parseInt(endTime[0]) + duration.amount;
            } else {
                endTime[0] = parseInt(endTime[0]) + duration.amount - 24;
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
    return endTime;
}

function endDateFn(date){
    var endDate;
    if (changeDate){
        endDate = date.split('-');
        endDate[2] = parseInt(endDate[2]) + 1;
        endDate = endDate.join('-');
    } else {
        endDate = date;
    }
    return endDate;
}

function convertDuration(duration){
  var millseconds = 0;
  switch(duration.unit) {
      case 'm':
          millseconds += duration.amount * 60 * 1000
          break;
      case 'h':
          millseconds += duration.amount * 60 * 60 * 1000
          break;
      case 'd':
          millseconds += duration.amount * 24 * 60 * 60 * 1000
          break;
      case 's':
          millseconds += duration.amount * 1000
      default:
          return millseconds
  }
  return millseconds;
}

module.exports = {
    endTimeFn, endDateFn, convertDuration
}
