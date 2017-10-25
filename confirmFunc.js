//new postInteractiveMessage that takes entire pending object
function postInteractiveMessage(message, pending, intent, pendingErr){
  var text = pendingErr ? 'If you want to make a new reminder, please cancel pending reminder\n' : '';
  text += makeSentence(pending);

  web.chat.postMessage(message.channel, text, { "attachments":[
      {
          "fallback": "Error setting reminder",
          "callback_id": message.channel,
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
              {
                  "name": intent,
                  "text": "Yes",
                  "type": "button",
                  "value": "yes"
              },
              {
                  "name": intent,
                  "text": "No",
                  "type": "button",
                  "value": "no"
              }
          ]
      }
    ]}
  );
};

function makeSentence(pending){
    if (!pending.Invitees){
        return `Confirm reminder to ${pending.Subject}} on ${pending['Date']}`
    } else {
        //read the invitees as names
        var invitees = pending.Invitees.length === 1 ? `${pending.Invitees[0]}>` :
        pending.Invitees.length === 2 ? `${pending.Invitees[0]}> and ${pending.Invitees[1]}>` :
        pending.Invitees.map((person, id) => (id !== invitees.length - 1 ? `${person}>, ` : `and ${person}>`)).join('');

        var locationString = pending.Location ? ` at ${pending.Location}` : ``;
        var durationString = pending.Duration ? `lasting ${pending.Duration} ` : ``;
        var subjectString = pending.Subject ? `about ${pending.Subject} ` : ``;

        return `Confirm meeting ${subjectString}${durationString}with ${invitees} on ${pending['Date']} at ${pending.Time}${locationString}`
    }
}
