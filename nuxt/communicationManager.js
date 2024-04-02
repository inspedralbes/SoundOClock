import { useAppStore } from './stores/app.js';

const url = "http://localhost:8080"; // development environment

function getUserSelectedSongs(id) {
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

function getSongs() {
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

function getAdminSongs() {
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

const comManager={
    getUserSelectedSongs,
    getSongs,
    getAdminSongs
};

export default comManager;