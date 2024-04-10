import { useAppStore } from './stores/app.js';

const url = "http://localhost:8080"; // development environment
// const url = "http://129.151.244.179:8080"; // production environment

function getUserSelectedSongs(id) {
    const store = useAppStore();
    fetch(`${url}/votingRecords/${id}`)
        .then(response => response.json())
        .then(data => {
            store.setUserSelectedSongs(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function getSongs() {
    const store = useAppStore();
    fetch(`${url}/songs`)
        .then(response => response.json())
        .then(data => {
            store.setProposedSongs(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function getAdminSongs() {
    const store = useAppStore();
    fetch(`${url}/adminSongs/${store.getUser().token}`)
        .then(response => response.json())
        .then(data => {
            store.setProposedSongsAdminView(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

export function getUsers() {
    const store = useAppStore();
    fetch(`${url}/users/${store.getUser().token}`)
        .then(response => response.json())
        .then(data => {
            store.setUsersAdminView(data);
            store.setAdminSelectedUser(data[0]);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function getPublicGroups() {
    const response = await fetch(`${url}/publicGroups`);
    const data = await response.json();
    return data;
}

async function setUserGroups(userId, groups, token) {
    const response = await fetch(`${url}/addGroupsToUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
        .then(response => response.json())
        .then(data => {
            console.log("bells: ", data);
            store.setBells(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function logout(token) {
    const response = await fetch(`${url}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            token,
        }),
    });
    const data = await response.json();
    return data;
}

const comManager = {
    getUserSelectedSongs,
    getSongs,
    getAdminSongs,
    getUsers,
    getPublicGroups,
    setUserGroups,
    getBells,
    logout,
    getUserInfo,
};

export default comManager;