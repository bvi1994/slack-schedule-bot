var { WebClient, RtmClient, RTM_EVENTS } = require('@slack/client')
const { createMessageAdapter } = require('@slack/interactive-messages');
var dialogflow = require('./dialogflow');
var token = process.env.SLACK_API_TOKEN || '';

var web = new WebClient(token);
var rtm = new RtmClient(token);
const slackMessages = createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);
rtm.start();




function handleDialogflowConvo(message){
  dialogflow.interpretUserMessage(message.text,message.user)
  .then(function(res){
    var { data } = res;
    console.log('DIALOGFLOW RESPONSE:',res.data);
    if(data.result.actionIncomplete){
      web.chat.postMessage(message.channel, data.result.fulfillment.speech);
    } else {
      web.chat.postMessage(message.channel,
        `You asked me to remind you to ${data.result.parameters.description} on ${data.result.parameters.date}`);
    }
  })
  .catch(function(err){
    console.log('Error sending message to Diagflow',err);
  });
};


function postInteractiveMessage(message, attachments){
  web.chat.postMessage(message.channel, "Would you like to play a game?", { "attachments":
  [
        {
            "text": "Choose a game to play",
            "fallback": "You are unable to choose a game",
            "callback_id": "wopr_game",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "game",
                    "text": "Chess",
                    "type": "button",
                    "value": "chess"
                },
                {
                    "name": "game",
                    "text": "Falken's Maze",
                    "type": "button",
                    "value": "maze"
                },
                {
                    "name": "game",
                    "text": "Thermonuclear War",
                    "style": "danger",
                    "type": "button",
                    "value": "war",
                    "confirm": {
                        "title": "Are you sure?",
                        "text": "Wouldn't you prefer a good game of chess?",
                        "ok_text": "Yes",
                        "dismiss_text": "No"
                    }
                }
            ]
        }
    ] }
  );
};

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if(!message.user){
    // web.chat.postMessage(message.channel, `You said: ${message.text}`);
    // console.log('Pong!');
    console.log("Message sent by a bot.")
    return;
  }
  handleDialogflowConvo(message);
    // `Hello. I'm your appointment bot. Please give me access to your Google calander at http://localhost:3000/setup?slackId=${message.user}`)
});

// rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
//   console.log('Reaction added:', reaction);
// });
//
// rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
//   console.log('Reaction removed:', reaction);
// });
