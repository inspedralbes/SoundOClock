import fetch from "node-fetch";
import axios from "axios";
import { config } from "dotenv";
import randomUser from "./randomUser.manager.js";

config();

let apiURL;

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "preprod"
) {
  apiURL = process.env.PRODUCTION_API_URL;
} else if (process.env.NODE_ENV === "development") {
  apiURL = process.env.DEVELOPMENT_API_URL;
}

async function getUserInfo(token) {
  const response = await fetch(apiURL + "getUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function tempLogin() {
  const data = await randomUser.getUser();
  let userData = await login(data.name, data.email, data.picture);
  return userData;
}

async function googleLogin(userToken) {
  // Get user info from google
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  const data = await response.json();

  // Send user info to the server
  let userData = await login(data.name, data.email, data.picture);

  return userData;
}

async function loginUserAndAdmin() {
  let userInfo = await login("miquel", "miquel@gmail.com");
  let adminInfo = await login("admin", "admin@gmail.com");
  let userToken = userInfo.token;
  let adminToken = adminInfo.token;
  return { userToken, adminToken };
}

async function login(name, email, picture) {
  let userData = await axios.post(
    apiURL + "login",
    {
      email: email,
      name: name,
      picture: picture,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  const roleNameResponse = await fetch(
    apiURL + "roles/" + userData.data.user.role_id,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    }
  );

  const roleNameData = await roleNameResponse.json();

  userData.data.user.role_name = roleNameData.name;
  return userData.data;
}

async function logout(token) {
  const response = await fetch(apiURL + "logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response;
}

async function getBlackList(token) {
  const response = await fetch(apiURL + "blacklist", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const songs = await response.json();
  return songs;
}

async function removeSongFromBlacklist(token, songSpotifyId) {
  const response = await fetch(apiURL + "blacklist/" + songSpotifyId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response;
}

async function addSongToBlackList(token, song) {
  const response = await fetch(apiURL + "blacklist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      spotify_id: song.id,
      name: song.name,
      artists: song.artists,
      img: song.img,
      preview_url: song.preview_url,
      submittedBy: song.submittedBy,
    }),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getPlaylists(playlist, limit, token) {
  try {
    let url = `https://api.spotify.com/v1/search?q=${playlist}&type=playlist&limit=${limit}`;
    let response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    let jsonResponse = await response.json();

    if (jsonResponse.playlists.items) {
      let songs = await getPlaylistSongs(
        jsonResponse.playlists.items[0].id,
        token
      );
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
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: "Bearer " + token,
    },
  });
  let jsonResponse = await response.json();
  return jsonResponse;
}

async function searchSong(search, limit, token, offset) {
  let url = `https://api.spotify.com/v1/search?query=${search}&type=track&offset=${offset}&limit=${limit}`;
  let songs = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  let jsonResponse = await songs.json();
  return jsonResponse;
}

async function searchSongId(id, token) {
  let url = `https://api.spotify.com/v1/tracks/${id}`;
  let song = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
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
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function deleteGroup(token, id) {
  const response = await axios.delete(`${apiURL}groups/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function getPublicGroups(token) {
  const response = await axios.get(`${apiURL}groups`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

async function getPublicCategories(token) {
  const response = await axios.get(`${apiURL}groupCategories`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}

async function getAllGroupsAndCategories() {
  const allGroupsPromise = axios
    .get(`${apiURL}groupsAll`)
    .then((response) => response.data);
  const allCategoriesPromise = axios
    .get(`${apiURL}groupCategoriesAll`)
    .then((response) => response.data);

  const [allGroups, allCategories] = await Promise.all([
    allGroupsPromise,
    allCategoriesPromise,
  ]);

  return {
    allGroups,
    allCategories,
  };
}

async function createGroupCategory(token, category) {
  const response = await axios.post(`${apiURL}groupCategories`, category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function createGroup(token, group) {
  const response = await axios.post(`${apiURL}groups`, group, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function fetchSpotifyPage(id) {
  try {
    const response = await axios.get(
      `https://open.spotify.com/embed/track/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify page:", error);
    return null;
  }
}

async function getUsers(token) {
  const response = await fetch(apiURL + "users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function updateUser(token, user) {
  const response = await fetch(apiURL + "user/" + user.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(user),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function setUserGroups(userId, token, groups) {
  const response = await fetch(apiURL + "groupsUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      groups: groups,
      user_id: userId,
    }),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getBells(token) {
  const response = await fetch(apiURL + "bells", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function setBellsGroupsConfiguration(token, bells) {
  const response = await fetch(apiURL + "updateBells", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(bells),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function showUser(token, userId) {
  const response = await fetch(apiURL + `user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getRoles(token) {
  const response = await fetch(apiURL + `roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function setSettings(token, settings, selectedSongs) {
  try {
    const response = await axios.put(
      apiURL + `settings`,
      {
        settings: settings,
        selectedSongs: selectedSongs,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    console.log("Settings updated", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

async function getSettings(token) {
  const response = await fetch(apiURL + `settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getPublicSettings() {
  const response = await axios.get(apiURL + "allSettings", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.data[0];
}

async function getUserGroups(token) {
  const response = await fetch(apiURL + `userGroups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function deleteUserFromGroup(token, group_id, user_id) {
  const response = await fetch(apiURL + `group/${group_id}/user/${user_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function sendDeletedSongMail(token, song) {
  const response = await axios.post(`${apiURL}mail`, song, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

async function getUsersVotes(users, token) {
  const response = await fetch(apiURL + `usersSearchInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      users: users,
    }),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function sendVoteReminderMail(usersVotedId) {
  console.log("enter reminder mail response");
  const response = await fetch(apiURL + "reminderMail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      usersVotedId: usersVotedId,
    }),
  });
  const jsonResponse = await response.json();
}

const comManager = {
  getUserInfo,
  googleLogin,
  tempLogin,
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
  getPublicCategories,
  fetchSpotifyPage,
  getUsers,
  updateUser,
  deleteGroup,
  updateGroup,
  setUserGroups,
  getBells,
  setBellsGroupsConfiguration,
  showUser,
  getRoles,
  getSettings,
  getPublicSettings,
  setSettings,
  getAllGroupsAndCategories,
  createGroupCategory,
  createGroup,
  getUserGroups,
  deleteUserFromGroup,
  getUsersVotes,
  sendDeletedSongMail,
  sendVoteReminderMail,
};

export default comManager;
