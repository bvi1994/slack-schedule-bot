/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */

var {WebClient, RtmClient, RTM_EVENTS} = require('@slack/client')
// var RtmClient = require('@slack/client').RtmClient;
// var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var token = process.env.SLACK_API_TOKEN || '';

var web = new WebClient(token);
var rtm = new RtmClient(token);
// var rtm = new RtmClient(token, { logLevel: 'debug' });
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  // console.log('Message:', message);
  if(!message.user){
    // web.chat.postMessage(message.channel, `You said: ${message.text}`);
    // console.log('Pong!');
    console.log("Message sent by a bot. Ignoring.")
    return;
  }
  web.chat.postMessage(message.channel,{
    text: `Hello. I'm your appointment bot. Please give me access to your Google calander at http://localhost:3000/setup?slackId=${message.user}`)  
  });
});

// rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
//   console.log('Reaction added:', reaction);
// });
//
// rtm.on(RTM_EVENTS.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
//   console.log('Reaction removed:', reaction);
// });
