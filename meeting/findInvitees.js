var { User } = require('../models/models');

function findInvitees(slackIds){
    return Promise.all(slackIds.map(id => User.findOne({ Name: id })))
    .catch(error => console.log('error: ', error));
}

module.exports = {
  findInvitees
};
