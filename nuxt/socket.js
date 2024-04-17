import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import { useRouter } from 'vue-router';
import comManager from './communicationManager';

const router = useRouter();

const url = "http://143.47.53.38:8080";
// const url = "http://localhost:8080";

export const socket = io(url);

socket.on("connect", () => {
  const pinia = useAppStore();

  // getSongs();

  socket.on("voteCasted", (data) => {
    comManager.getSongs();
    comManager.getUserSelectedSongs(pinia.getUser().id);
    pinia.setIsLoadingVote({ state: false, selectedSong: null });
  });

  socket.on("songReported", (data) => {
  });

  socket.on("songDeleted", (data) => {
    comManager.getSongs();
    comManager.getAdminSongs();
  });

  socket.on("userBanned", (data) => {
  });

  socket.on("loginData", (id, mail, name, token, groups) => {
    pinia.setUser(id, mail, name, token, groups);
    if (pinia.getUser().groups.length > 0) {
      navigateTo({ path: '/llista_propostes' });
    } else {
      navigateTo({ path: '/escollirGrup' });
    }
  });



  socket.on('sendGroups', (data) => {
    pinia.setClassGroups(data);
  });

  socket.on('groupDeleted', (data) => {
    pinia.deleteGroup(data.group_id);
  });

  socket.on('groupUpdated', (data) => {
  });

  socket.on('songPosted', (data) => {
    pinia.setPostedSongStatus(data);
  });

  socket.on('postError', (data) => {
    pinia.setPostedSongStatus(data);
  });

  socket.on('bellsGroupsRelationsUpdated', (data) => {
    console.log('socket bellsGroupsRelationsUpdated data received', data);
  });

  socket.on('updateBellsGroupsRelationsError', (data) => {
    console.log('socket updateBellsGroupsRelationsError data received', data);
  });

  socket.on('isReadReportStatusChanged', (data) => {
    console.log('socket isReadReportStatusChanged data received', data);
  });

  socket.on("disconnect", () => {

  });

  // FUNCTIONS START
  function getUserSelectedSongs(id) {
    fetch(`${url}/votingRecords/${id}`)
      .then(response => response.json())
      .then(data => {
        pinia.setUserSelectedSongs(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function getSongs() {
    fetch('${url}/songs')
      .then(response => response.json())
      .then(data => {
        pinia.setProposedSongs(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function getAdminSongs() {
    fetch('${url}/adminSongs')
      .then(response => response.json())
      .then(data => {
        pinia.setProposedSongsAdminView(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
});




