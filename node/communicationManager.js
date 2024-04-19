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
  let adminInfo = await login("admin", "admin@gmail.com");
  console.log(userInfo, adminInfo);
  let userToken = userInfo.token;
  let adminToken = adminInfo.token;
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
  console.log(jsonResponse);
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

async function removeSongFromBlacklist(token, songSpotifyId) {
  const response = await fetch(apiURL + 'blacklist/' + songSpotifyId, {
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
  console.log(song);
  const response = await fetch(apiURL + 'blacklist', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({
      spotify_id: song.id,
      name: song.name,
      artists: song.artists,
      img: song.img,
      preview_url: song.preview_url
    })
  });
  console.log(response);
  return response;
}

async function getPlaylists(playlist, limit, token) {

  try {
    let url = `https://api.spotify.com/v1/search?q=${playlist}&type=playlist&limit=${limit}`;
    let response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    let jsonResponse = await response.json();


    if (jsonResponse.playlists.items) {
      let songs = await getPlaylistSongs(jsonResponse.playlists.items[0].id, token);
      return songs;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getPlaylistSongs(id, token) {
  let limit = 15;
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

async function getGroups(token) {
  const response = await axios.get(`${apiURL}groupsAll`);
  return response.data;
}

async function updateGroup(token, group) {
  const response = await axios.put(`${apiURL}groups/${group.id}`, group, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

async function deleteGroup(token, id) {
  const response = await axios.delete(`${apiURL}groups/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  return response.data;
}

async function getPublicGroups(token) {
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

async function updateUser(token, user) {
  const response = await fetch(apiURL + 'user/' + user.id, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(user)
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function setUserGroups(userId, token, groups) {
  const response = await fetch(apiURL + 'addGroupsToUser/' + userId, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(groups)
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getBells(token) {
  const response = await fetch(apiURL + 'bells', {
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

async function setBellsGroupsConfiguration(token, bells) {
  const response = await fetch(apiURL + 'updateBells', {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(bells)
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function showUser(token, userId) {
  const response = await fetch(apiURL + `user/${userId}`, {
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

async function getRoles(token) {
  const response = await fetch(apiURL + `roles`, {
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
  updateUser,
  deleteGroup,
  updateGroup,
  setUserGroups,
  getBells,
  setBellsGroupsConfiguration,
  showUser,
  getRoles
};

export default comManager;