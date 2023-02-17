const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = function(data) {
  for (const pass of data) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds`);
  }
};

nextISSTimesForMyLocation()
  .then((passTime) => {
    printPassTimes(passTime);
  })
  .catch((error) => {
    console.log("It didn't work: ", error);
  });