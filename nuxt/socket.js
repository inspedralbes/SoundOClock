import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
// import router from "./router";

let url = "http://localhost:8080";

export const socket = io(url);

socket.on("connect", () => {
  console.log("user connected");
  const pinia = useAppStore();

  socket.on("testing", (num) => {
    console.log(num)
  });

});

socket.on("disconnect", () => {
});