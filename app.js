var express = require('express');
var app = express();

require('./example-rtm-client');

app.post('/interactive', function(req, res) {
  console.log(req);
  res.send('Your server is working!');
});

app.listen(3000);
