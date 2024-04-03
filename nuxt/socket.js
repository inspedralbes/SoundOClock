import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import { useRouter } from 'vue-router';
import { getUserSelectedSongs, getSongs, getAdminSongs } from './communicationManager';

const router = useRouter();

let url = "http://localhost:8080";

export const socket = io(url);

socket.on("connect", () => {
  const pinia = useAppStore();
  console.log("user connected");

  socket.on("voteCasted", (data) => {
    console.log("socket voteCasted data received: ", data.song);
    getSongs();
    getUserSelectedSongs(pinia.getUser().id);
    pinia.setIsLoadingVote({ state: false, selectedSong: null });
  });

  socket.on("songReported", (data) => {
    console.log("socket songReported data received: ", data.message);
  });

  socket.on("songDeleted", (data) => {
    console.log("socket songDeleted data received: ", data.song);
    getSongs();
    getAdminSongs();
  });

  socket.on("userBanned", (data) => {
    console.log("socket userBanned data received: ", data.message);
  });

  socket.on("loginData", (id, mail, name, group, token) => {
    console.log("socket loginData data received: ", id, mail, name, group, token);
    pinia.setUser(id, mail, name, group, token);
    if (pinia.getUser().group) {
      navigateTo({ path: '/llista_propostes' });
    } else {
      navigateTo({ path: '/escollirGrup' });
    }
  });

});

socket.on("disconnect", () => {
});