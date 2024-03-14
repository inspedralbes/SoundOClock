import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
// import router from "./router";

let url = "http://localhost:8080";

export const socket = io(url);

socket.on("connect", () => {
  console.log("user connected");
  const pinia = useAppStore();

  pinia.setLoading(true);
  fetch('http://localhost:8080/songs')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      pinia.setProposedSongs(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  pinia.setLoading(false);

  socket.on("voteCasted", (data) => {
    console.log("socket voteCasted data received: ", data.song);

    fetch('http://localhost:8080/songs')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        pinia.setProposedSongs(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });

  socket.on("loginData", (mail, name) => {
    console.log("socket loginData data received: ", mail, name);
    pinia.setUser(mail, name);
  });

});

socket.on("disconnect", () => {
});