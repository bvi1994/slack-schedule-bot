var { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const { createMessageAdapter } = require('@slack/interactive-messages');
var dialogflow = require('./dialogflow');
var token = process.env.SLACK_API_TOKEN || '';
var { User } = require('./models/models');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var web = new WebClient(token);
var rtm = new RtmClient(token);
const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
rtm.start();


function handleDialogflowConvo(message){
  var data;
  dialogflow.interpretUserMessage(message.text, message.user)
  .then(function(res){
    data = res.data;
    if(data.result.actionIncomplete){
      web.chat.postMessage(message.channel, data.result.fulfillment.speech);
    }
    else{
      return User.findOne({Name: message.user});
    }
  })
  .then(function(user){
    if(user) {
      user.Pending = Object.assign({}, data.result.parameters);
      return user.save();
    }
  })
  .then(function(user){
    if(user){
      postInteractiveMessage(message, user.Pending, data.result.metadata.intentName);
    }
  })
  .catch(function(err){
    console.log('Error:',err);
  });
};


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
        return `Confirm reminder to ${pending.Subject} on ${pending['Date']}`
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

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if(!message.user){
    return;
  }
  User.findOrCreate(message.user)
  .then(function(user){
      if (user.Pending){
          postInteractiveMessage(message, user.Pending.Subject, user.Pending.Date, true);
          return;
      }
      handleDialogflowConvo(message);
  })
  .catch(function(err){
      console.log('Error:',err);
  });
});

// rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
//    console.log('Reaction added:', reaction);
// });

//
// rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
//   console.log('Reaction removed:', reaction);
// });
