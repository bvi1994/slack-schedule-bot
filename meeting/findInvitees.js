var { User } = require('../models/models');
function findInvitees(slackIds){
    return Promise.all(slackIds.map(id => User.findOne({Name: id})))
    .then(values => values)
    .catch(error => console.log('error: ', error));
}

module.exports = {
  findInvitees
};
