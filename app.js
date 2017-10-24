var express = require('express');
var app = express();

require('./example-rtm-client');
var google = require('./google');

app.post('/interactive', function(req, res) {
  console.log(res);
  res.send('Your server is working!');
});

app.get('/setup', function(req, res){
  var url = google.generateAuthUrl();
  res.redirect(url);
  // console.log(url);
});

app.get('/google/callback', function(req, res){
  res.send("We now have access to your Google Calander!");
})

app.listen(3000);
