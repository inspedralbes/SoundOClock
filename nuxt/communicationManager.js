import { useAppStore } from "./stores/app.js";

let url;

url = import.meta.env.VITE_APP_SOCKET_URI;
// url = "http://localhost:8080";

function getUserSelectedSongs(id) {
  const store = useAppStore();
  fetch(`${url}/votingRecords/${id}`)
    .then((response) => response.json())
    .then((data) => {
      store.setUserSelectedSongs(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getUserReportedSongs(id) {
  const store = useAppStore();
  fetch(`${url}/reportSongs/${id}`)
    .then((response) => response.json())
    .then((data) => {
      store.setUserReportedSongs(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getSortedVotedSongs() {
  const store = useAppStore();
  fetch(`${url}/sortedVotedSongs`)
    .then((response) => response.json())
    .then((data) => {
      store.setSortedVotedSongs(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getSongs() {
  const store = useAppStore();
  fetch(`${url}/songs`)
    .then((response) => response.json())
    .then((data) => {
      store.setProposedSongs(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getAdminSongs() {
  const store = useAppStore();
  fetch(`${url}/adminSongs/${store.getUser().token}`)
    .then((response) => response.json())
    .then((data) => {
      store.setProposedSongsAdminView(data);
      store.setLoadingAdminComponent(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

export function getUsers() {
  const store = useAppStore();
  fetch(`${url}/users/${store.getUser().token}`)
    .then((response) => response.json())
    .then((data) => {
      store.setUsersAdminView(data);
      store.setAdminSelectedUser(data[0]);
      store.setLoadingAdminComponent(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function getPublicGroupsAndCategories() {
  const publicGroupsPromise = fetch(`${url}/publicGroups`).then((response) =>
    response.json()
  );
  const publicCategoriesPromise = fetch(`${url}/publicCategories`).then(
    (response) => response.json()
  );

  const [publicGroups, publicCategories] = await Promise.all([
    publicGroupsPromise,
    publicCategoriesPromise,
  ]);

  return {
    publicGroups,
    publicCategories,
  };
}

async function getAllGroupsAndCategories() {
  const response = await fetch(`${url}/allGroupsAndCategories`);
  const data = await response.json();
  return data;
}

async function setUserGroups(userId, groups, token) {
  const response = await fetch(`${url}/addGroupsToUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      groups,
      token,
    }),
  });
  const data = await response.json();
  return data;
}

async function getBells() {
  const store = useAppStore();
  fetch(`${url}/bells/${store.getUser().token}`)
    .then((response) => response.json())
    .then((data) => {
      store.setBells(data);
      store.setLoadingAdminComponent(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function logout(token) {
  const response = await fetch(`${url}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });
  const data = await response.json();
  return data;
}

async function getUserInfo(token) {
  const response = await fetch(`${url}/userInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });
  const data = await response.json();
  return data;
}

async function storeSelectedSongs(token, songs) {
  const response = await fetch(`${url}/storeSelectedSongs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
      songs,
    }),
  });
  const data = await response.json();
  return data;
}

async function createGroupCategory(token, category) {
  const response = await fetch(`${url}/createGroupCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
      category,
    }),
  });
  const data = await response.json();
  return data;
}

async function createGroup(token, group) {
  const response = await fetch(`${url}/createGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
      group,
    }),
  });
  const data = await response.json();
  return data;
}

export function getRoles() {
  const store = useAppStore();
  fetch(`${url}/roles/${store.getUser().token}`)
    .then((response) => response.json())
    .then((data) => {
      store.setRoles(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function getUserGroups() {
  const store = useAppStore();
  const response = await fetch(`${url}/userGroups/${store.getUser().token}`);
  const data = await response.json();
  return data;
}

async function getSelectedSongs() {
  const store = useAppStore();
  const response = await fetch(`${url}/getSelectedSongs`);
  const data = await response.json();
  store.setFinalSongsList(data);
}

const comManager = {
  getUserSelectedSongs,
  getSongs,
  getAdminSongs,
  getUsers,
  getPublicGroupsAndCategories,
  getAllGroupsAndCategories,
  setUserGroups,
  getBells,
  logout,
  getUserInfo,
  getSortedVotedSongs,
  createGroupCategory,
  createGroup,
  getRoles,
  storeSelectedSongs,
  getUserGroups,
  getUserReportedSongs,
  getSelectedSongs,
};

export default comManager;
