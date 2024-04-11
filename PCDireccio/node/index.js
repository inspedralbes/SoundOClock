import { io } from "socket.io-client";
import { exec, execFile } from "child_process";

let url = "http://localhost:8080";

const socket = io(url);
const Script = `C:\\Users\\SoundO'Clock\\Desktop\\script\\ScriptLaunch.bat`;

socket.on("connect", () => {
    console.log("Connected to the server");
    socket.emit("dirPC");

    socket.on("executeSendBells", () => {
        execFile(Script, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error}`);
                return;
            }
            console.log(`Script output: ${stdout}`);
        });
    });
});