const request = require('request-promise-native');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = () => {
  const ipUrl = "https://api.ipify.org?format=json";
  return request(ipUrl);
};

/*
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = (body) => {
  const locUrl = "https://api.freegeoip.app/json/";
  const locApiKey = "31bb8260-3bf0-11ec-b545-fde17241d2c8";

  const ip = JSON.parse(body).ip;
  return request(`${locUrl}${ip}?apikey=${locApiKey}`);
};

/*
 * Requests data from api.open-notify.org using provided lat/long data
 * Input: JSON body containing geo data response from freegeoip.app
 * Returns: Promise of request for fly over data, returned as JSON string
 */
const fetchISSFlyOverTimes = function(body) {
  const issUrl = "https://iss-pass.herokuapp.com/json/";

  const { latitude, longitude } = JSON.parse(body);
  const url = `${issUrl}?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

/*
 * Input: None
 * Returns: Promise for fly over data for users location
 */
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
