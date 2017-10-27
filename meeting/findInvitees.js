var { User } = require('../models/models')
function findInvitees(slackIds){

    Promise.all(slackIds.map(id => User.findOne({Name: id})))
    .then(values => return values)
    .catch(error => console.log('error: ', error))
}

module.exports = {
  findInvitees
};
