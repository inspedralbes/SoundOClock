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

async function loginUserAndAdmin() {
  let userToken = await login("miquel", "miquel@gmail.com");
  let adminToken = await login("admin", "admin@gmail.com");
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
  return jsonResponse.token;
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

export { getUserInfo, loginUserAndAdmin, logout };