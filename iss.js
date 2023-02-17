// will contain most of the logic for fetching the data from each api endpoint
const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    const ip = data.ip;
    return callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching lat & lon. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      return callback(Error(message), null);
    }
    const latLon = {
      latitude: data.latitude.toString(),
      longitude: data.longitude.toString()
    };
    
    return callback(null, latLon);
  });
};

const fetchISSFlyOverTimes = function(coordinates, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const issErrorMsg = `Status Code ${response.statusCode} when fetching ISS. Response: ${body}`;
      return callback(Error(issErrorMsg), null);
    }
    
    const data = JSON.parse(body).response;
    return callback(null, data);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, latLon) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(latLon, (error, data) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, data);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
