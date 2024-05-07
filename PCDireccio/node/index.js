import { io } from "socket.io-client";
import { exec, execFile } from "child_process";
import fs from "fs";
import yauzl from "yauzl"

let url = "http://localhost:8080";
// let url = "http://timbre.inspedralbes.cat:8080";

const socket = io(url);
// const Script = `C:\\Users\\SoundO'Clock\\Desktop\\script\\ScriptLaunch.bat`;

const Script = `C:\\Users\\a20miqmorcho_insped2\\Downloads\\repo\\tr3-soundoclock\\PCDireccio\\script\\ScriptLaunch.bat`;
const apiUrl = "http://localhost:8080/selectedSongs";
// const apiUrl = "http://timbre.inspedralbes.cat:8080/selectedSongs";
socket.on("connect", () => {
    console.log("Connected to the server");
    socket.emit("dirPC");

    socket.on("executeSendBells", async () => {
        console.log("Executing script");
        // await getFiles();
        execFile(Script, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error}`);
                return;
            }
            console.log(`Script output: ${stdout}`);
            socket.emit("getPcDirLogs", stdout);
        });
    });
});


async function getFiles() {
    try {
        console.log('Downloading ZIP...');
        let zipData = await downloadZip(apiUrl);
        console.log('Handling ZIP data...');
        handleZipData(zipData);
        console.log('Done handling ZIP data');
    } catch (err) {
        console.error('Error downloading ZIP:', err);
    }
}

function downloadZip(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => {
                let buffer = Buffer.from(arrayBuffer);
                console.log('ZIP downloaded successfully');
                resolve(buffer); // The buffer is resolved here
            })
            .catch(error => {
                console.error('Error downloading ZIP:', error);
                reject(error);
            });
    });
}


function handleZipData(zipData) {
    console.log('Extracting ZIP...');
    const extractPath = "C:\\Users\\SoundO'Clock\\Songs"; // Replace with your desired path
    console.log(zipData);
    yauzl.fromBuffer(zipData, (err, zipFile) => {
        if (err) {
            console.error('Error reading ZIP:', err);
            return;
        }
        zipFile.on('entry', (entry) => {
            console.log('Extracting:', entry.fileName);
            if (!entry.fileName.endsWith('/')) { // Ignore directories
                const filePath = `${extractPath}/${entry.fileName}`;
                zipFile.openReadStream(entry, function (err, readStream) {
                    if (err) throw err;
                    readStream.pipe(fs.createWriteStream(filePath)); // Extract and save file
                });
            }
        });
        zipFile.on('end', () => {
            console.log('Files extracted successfully to:', extractPath);
        });
    });
}