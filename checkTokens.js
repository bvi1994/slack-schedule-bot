var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var { Users } = require('./models/models')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function checkTokens(user){
  if(user.Google.token.expiry_date < Date.now()){
    OAuth2.refreshAccessToken(err, tokens){

    }
  }
}
