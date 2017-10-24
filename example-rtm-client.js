var { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const { createMessageAdapter } = require('@slack/interactive-messages');
var dialogflow = require('./dialogflow');
var token = process.env.SLACK_API_TOKEN || '';
var User = require('./models/models');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var web = new WebClient(token);
var rtm = new RtmClient(token);
const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
rtm.start();


function handleDialogflowConvo(message){
  dialogflow.interpretUserMessage(message.text, message.user)
  .then(function(res){
    var { data } = res;
    console.log('DIALOGFLOW RESPONSE:',res.data);
    if(data.result.actionIncomplete){
      web.chat.postMessage(message.channel, data.result.fulfillment.speech);
    } else {
        User.findOne({Name: message.user}, function(err, user){
            user.Pending = Object.assign({}, {Subject: data.result.parameters.description, Date: data.result.parameters.date} );
            user.save(function(err){
                if (err){
                console.log("error saving pending reminder", err);}
            })
        })
      .then(postInteractiveMessage(message, data.result.parameters.description, data.result.parameters.date))
      .catch(function(err){
          console.log("error", err)
      })
    }
  })
  .catch(function(err){
    console.log('Error sending message to Diagflow',err);
  });
};


function postInteractiveMessage(message, desc, date){
  var text = `Confirm reminder to ${desc} on ${date}`;

  web.chat.postMessage(message.channel, text, { "attachments":[
      {
          "fallback": "Error setting reminder",
          "callback_id": message.channel,
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
              {
                  "name": "yes",
                  "text": "Yes",
                  "type": "button",
                  "value": "yes"
              },
              {
                  "name": "no",
                  "text": "No",
                  "type": "button",
                  "value": "no"
              }
          ]
      }
    ]}
  );
};

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if(!message.user){
    // web.chat.postMessage(message.channel, `You said: ${message.text}`);
    // console.log('Pong!');
    console.log("Message sent by a bot.")
    return;
  }
  User.findOne({Name: message.user}, function(err, result){
      if (result && result.Pending){
          web.chat.postMessage(message.channel, 'If you want to make a new reminder, please cancel pending reminder');
          postInteractiveMessage(message, result.Pending.Subject, result.Pending.Date);
          return;
      }
      if (!result){
          var newUser = new User({
              Name: message.user
          })
          newUser.save(function(err){
              console.log('Error saving to DB: ', err)
              console.log(message.user)
          })
      }
      handleDialogflowConvo(message);
  })

    // `Hello. I'm your appointment bot. Please give me access to your Google calander at http://localhost:3000/setup?slackId=${message.user}`)
});

// rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
//   console.log('Reaction added:', reaction);
// });
//
// rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
//   console.log('Reaction removed:', reaction);
// });
