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
      Subject: 'Eat',
      Date: today,
      Name: 'U7PHN17L6'
  },
  {
      Subject: 'Sleep',
      Date: today,
      Name: 'test'
  },
  {
      Subject: 'Watch TV',
      Date: tomorrow,
      Name: 'test'
  },
  {
      Subject: 'Shop',
      Date: tomorrow,
      Name: 'test'
  },
  {
      Subject: 'Relax',
      Date: distantFuture,
      Name: 'test'
  },
  {
      Subject: 'Study',
      Date: distantFuture,
      Name: 'test'
  }
];

module.exports = {
  data
};
