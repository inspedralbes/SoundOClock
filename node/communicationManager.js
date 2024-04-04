import fetch from 'node-fetch';
import axios from 'axios';
import { config } from 'dotenv';
config();

let apiURL;

if (process.env.NODE_ENV === 'production') {
  apiURL = process.env.PRODUCTION_API_URL;
} else if (process.env.NODE_ENV === 'development') {
  apiURL = process.env.DEVELOPMENT_API_URL;
}

async function getUserInfo(token) {
  const response = await fetch(apiURL + 'getUser', {
    method: 'GET',
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

async function getBlackList(token) {
  console.log("Get Blacklist: " + apiURL + 'blacklist')
  const response = await fetch(apiURL + 'blacklist', {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
      },
  });
  return response;
}

async function removeSongFromBlacklist(token, song) {
  const response = await fetch(apiURL + 'blacklist/' + song.id, {
      method: 'DELETE',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
      }
  });
  return response;
}

async function addSongToBlackList(token, song) {
  const response = await fetch(apiURL + 'blacklist', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      nom: song.title,
      spotify_id: song.id,
    })
  });
  return response;
}

async function getPlaylists(playlist, limit, token) {
  console.log("Playlist start", playlist, limit, token);
  let url = `https://api.spotify.com/v1/search?q=${playlist}&type=playlist&limit=${limit}`;
  console.log("url", url);
  let response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  let jsonResponse = await response.json();
  console.log("respuesta", jsonResponse.playlists.items);
  if (jsonResponse.playlists.items) {
    console.log("playlistID:", jsonResponse.playlists.items[0].id);
    let songs = await getPlaylistSongs(jsonResponse.playlists.items[0].id, token);
    console.log("Playlist Songs:", songs);
    return songs;
  }
}

async function getPlaylistSongs(id, token) {
  let limit = 15;
  console.log("Playlist Songs start");
  console.log(id);
  let url = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=0&limit=${limit}`;
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": "Bearer " + token,
    }
  });
  let jsonResponse = await response.json();
  return jsonResponse;
}

async function searchSong(search, limit, token) {
  let url = `https://api.spotify.com/v1/search?query=${search}&type=track&offset=0&limit=${limit}`;
  let songs = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  let jsonResponse = await songs.json();
  return jsonResponse;
}

async function searchSongId(id, token) {
  let url = `https://api.spotify.com/v1/tracks/${id}`;
  let song = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  let jsonResponse = await song.json();
  return jsonResponse;
}

async function getGroups(token){
  const response = await axios.get(`${apiURL}groupsAll`);
  return response.data;
}

async function updateGroup(token,group){
  const response = await axios.put(`${apiURL}groups/${group.id}`, group, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

async function deleteGroup(token,id){
  const response = await axios.delete(`${apiURL}groups/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  return response.data;
}

async function getPublicGroups(token){
  const response = await axios.get(`${apiURL}groups`, {
    headers: {
      "Authorization": "Bearer " + token,
    }
  });
  return response.data;
}

async function fetchSpotifyPage(id) {
  try {
    const response = await axios.get(`https://open.spotify.com/embed/track/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify page:', error);
    return null;
  }
}

async function getUsers(token) {
  const response = await fetch(apiURL + 'users', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function banUser(token, user) {
  const response = await fetch(apiURL + 'user/' + user.id, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(user)
  });
  console.log("BAN USER", response);
  return response;
}


const comManager = {
  getUserInfo,
  googleLogin,
  loginUserAndAdmin,
  login,
  logout,
  getBlackList,
  removeSongFromBlacklist,
  addSongToBlackList,
  getPlaylists,
  getPlaylistSongs,
  searchSong,
  searchSongId,
  getGroups,
  getPublicGroups,
  fetchSpotifyPage,
  getUsers,
  banUser,
  deleteGroup,
  updateGroup
};

export default comManager;