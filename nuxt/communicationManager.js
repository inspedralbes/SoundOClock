import { useAppStore } from './stores/app.js';

const url = "http://localhost:8080"; // development environment

export function getUserSelectedSongs(id) {
    const store = useAppStore();
    fetch(`${url}/votingRecords/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("user selected songs: ", data);
            store.setUserSelectedSongs(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

export function getSongs() {
    const store = useAppStore();
    fetch(`${url}/songs`)
        .then(response => response.json())
        .then(data => {
            console.log("songs: ", data);
            store.setProposedSongs(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

export function getAdminSongs() {
    const store = useAppStore();
    fetch(`${url}/adminSongs`)
        .then(response => response.json())
        .then(data => {
            console.log("songs: ", data);
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
            console.log("users: ", data);
            store.setUsersAdminView(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}