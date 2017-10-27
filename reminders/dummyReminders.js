const today = new Date()
today.setHours(0,0,0,0);
var tomorrow = new Date();
tomorrow.setHours(0,0,0,0);
var distantFuture = new Date();
distantFuture.setHours(0,0,0,0);
tomorrow.setDate(today.getDate()+1);
distantFuture.setDate(tomorrow.getDate()+5);
data = [
  {
      Subject: 'eat',
      Date: today,
      UserId: 'U7PHN17L6'
  },
  {
      Subject: 'Sleep',
      Date: today,
      UserId: 'test'
  },
  {
      Subject: 'Watch TV',
      Date: tomorrow,
      UserId: 'test'
  },
  {
      Subject: 'Shop',
      Date: tomorrow,
      UserId: 'test'
  },
  {
      Subject: 'Relax',
      Date: distantFuture,
      UserId: 'test'
  },
  {
      Subject: 'Study',
      Date: distantFuture,
      UserId: 'test'
  }
];

module.exports = {
  data
};
