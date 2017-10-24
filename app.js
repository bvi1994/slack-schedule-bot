var express = require('express');
var app = express();

require('./example-rtm-client');

app.post('/', function(req, res) {
  res.send('Your server is working!');
});

app.listen(3000);
