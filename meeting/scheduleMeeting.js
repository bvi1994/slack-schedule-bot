var google = require('../google');

function scheduleMeeting(invitee, pending) {
    return google.createCalendarEvent(invitee.Google.tokens, pending)
}

module.exports = {
  scheduleMeeting
}
