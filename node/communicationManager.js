const fetch = require('node-fetch');
require('dotenv').config();

let apiURL;

if(process.env.NODE_ENV === 'production') {
    apiURL = process.env.PRODUCTION_API_URL;
} else if (process.env.NODE_ENV === 'development') {
    apiURL = process.env.DEVELOPMENT_API_URL;
}

// async function getSongs() {
//     const response = await fetch(apiURL + 'songs');
//     const jsonResponse = await response.json();
//     return jsonResponse;
// }

async function getUserInfo(token) {
  const response = await fetch(apiURL + 'user', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

module.exports = { getUserInfo }