import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

let apiURL;

if(process.env.NODE_ENV === 'production') {
    apiURL = process.env.PRODUCTION_API_URL;
} else if (process.env.NODE_ENV === 'development') {
    apiURL = process.env.DEVELOPMENT_API_URL;
}

async function getUserInfo(token) {
  const response = await fetch(apiURL + 'getUser', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function googleLogin(userToken) {
  // Get user info from google
  const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  });
  const data = await response.json();

  // Send user info to the server
  const userData = await login(data.name, data.email);
  return userData;
}

async function loginUserAndAdmin() {
  let userInfo = await login("miquel", "miquel@gmail.com");
  let adminIndo = await login("admin", "admin@gmail.com");
  let userToken = userInfo.token;
  let adminToken = adminIndo.token;
  return { userToken, adminToken };
}

async function login(name, email) {
  const response = await fetch(apiURL + 'login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: email,
      name: name,
    })
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function logout(token) {
  const response = await fetch(apiURL + 'logout', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    }
  });
  return response;
}

export { getUserInfo, loginUserAndAdmin, logout, googleLogin };