// will require and run main fetch function
const { nextISSTimesForMyLocation } = require('./iss');

const printPasses = function(data) {
  for (const pass of data) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds`);
  }
};

nextISSTimesForMyLocation((error, data) => {
  if (error) {
    return console.log(`It didn't work!`, error.message);
  }
  
  printPasses(data);
});

