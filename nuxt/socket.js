import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import { useRouter } from 'vue-router';
import comManager from './communicationManager';

const router = useRouter();

// const url = "http://129.151.244.179:8080";
const url = "http://localhost:8080";

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

  socket.on('userRoleModified', (data) => {
    console.log('socket userRoleModified data received', data);
  });

  socket.on('refreshUsersData', () => {
    comManager.getUsers();
  });

  socket.on('sendRoles', (data) => {
    pinia.setRoles(data);
  });

  socket.on("disconnect", () => {

  });

  socket.on('sendHtmlSpotify', (htmlSpotify, songId) => {

    // Crear un elemento HTML temporal
    const tempElement = document.createElement('div');

    // Establecer el HTML recibido en el elemento temporal
    tempElement.innerHTML = htmlSpotify;

    // Obtener el script por su id
    const scriptElement = tempElement.querySelector('#__NEXT_DATA__');

    // Verificar si se encontró el elemento
    if (scriptElement) {
      // Acceder al contenido JSON dentro del script y convertirlo a objeto JavaScript
      const jsonData = JSON.parse(scriptElement.textContent);

      // Acceder al AudioPreviewURL
      const AudioPreviewURL = jsonData.props.pageProps.state.data.entity.audioPreview.url;

      // Fetch to AudioPreviewURL to get the audio file .mp3 and play it
      fetch(AudioPreviewURL)
        .then(response => response.blob())
        .then(blob => { // blob is the file track.mp3
          const audioURL = URL.createObjectURL(blob);
          pinia.setSongStatus(new Audio(audioURL), songId, true);
          pinia.playSong();
        })
        .catch(error => {
          console.error('Error getting the audio file:', error);
        });
    } else {
      console.error('No se encontró el script con el id "__NEXT_DATA__" en el HTML recibido');
    }
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




