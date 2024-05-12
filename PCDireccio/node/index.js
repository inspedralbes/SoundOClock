import { io } from "socket.io-client";
import { exec, execFile } from "child_process";
import fs from "fs";
import yauzl from "yauzl"
import path from 'path';

// let url = "http://localhost:8080";
let url = "http://timbre.inspedralbes.cat:8080";

const socket = io(url);

// const apiUrl = "http://localhost:8080/selectedSongs";
const apiUrl = "http://timbre.inspedralbes.cat:8080/selectedSongs";

socket.on("connect", () => {
    console.log("Connected to the server");
    socket.emit("dirPC");

    socket.on("executeSendBells", async () => {
        console.log("Executing script");
        socket.emit("getPcDirLogs", "Executant script");
        await getFiles();
        executeScript();
    });
});

async function getFiles() {
    try {
        console.log('Downloading ZIP...');
        socket.emit("getPcDirLogs", "Descarregnat ZIP...");
        let zipData = await downloadZip(apiUrl);
        console.log('Handling ZIP data...');
        socket.emit("getPcDirLogs", "Manipulant ZIP...");
        handleZipData(zipData);
        console.log('Done handling ZIP data');
        socket.emit("getPcDirLogs", "Manipulació ZIP completada");
    } catch (err) {
        console.error('Error downloading ZIP:', err);
        socket.emit("getPcDirLogs", "Error descarregant ZIP");
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
                socket.emit("getPcDirLogs", "ZIP descarregat amb èxit");
                resolve(buffer); // The buffer is resolved here
            })
            .catch(error => {
                console.error('Error downloading ZIP:', error);
                socket.emit("getPcDirLogs", "Error descarregant ZIP");
                reject(error);
            });
    });
}

function handleZipData(zipData) {
    console.log('Extracting ZIP...');
    socket.emit("getPcDirLogs", "Extreient ZIP...");
    const extractPath = "C:\\Users\\SoundO'Clock\\Songs"; // Replace with your desired path
    console.log(zipData);
    yauzl.fromBuffer(zipData, (err, zipFile) => {
        if (err) {
            console.error('Error reading ZIP:', err);
            console.log('error');
            socket.emit("getPcDirLogs", "Error llegint ZIP");
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
            socket.emit("getPcDirLogs", "Arxius extrets correctament");
        });
    });
}

function executeScript() {
    // const startChromeCommand = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "file:///C:/Users/SoundO'Clock/Desktop/script/ui.vision.html?direct=1&macro=Script"`;
    // exec(startChromeCommand, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error starting Chrome: ${error}`);
    //         socket.emit("getPcDirLogs", "Error iniciant Chrome");
    //         return;
    //     }
    // });

    // Wait for file to exist
    const filePath = "C:\\Users\\SoundO'Clock\\Desktop\\logs\\UIvisionLogs\\uivision_log.txt";
    const intervalId = setInterval(() => {
        if (fs.existsSync(filePath)) {
            clearInterval(intervalId);
            handleFile(filePath);
        } else {
            console.log('Waiting for file...');
            socket.emit("getPcDirLogs", "Esperant arxiu...");
        }
    }, 5000);
}

function handleFile(filePath) {

    const numberFilePath = `C:\\Users\\SoundO'Clock\\Desktop\\logs\\id.txt`;

    // Read the number from the file
    let number = Number(fs.readFileSync(numberFilePath, 'utf8'));

    // Get current date and time
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();
    const HH = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    // Depured log path
    const depuredLogPath = `C:\\Users\\SoundO'Clock\\Desktop\\logs\\DepuredLogs\\${number}-${DD}_${MM}_${YYYY}-${HH}_${min}_${sec}-depured_log.txt`;

    // Logs history directory
    const logsHistoryDir = "C:\\Users\\SoundO'Clock\\Desktop\\logs\\UIvisionLogs\\LogsHistory";

    // Read file line by line
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
    const depuredLines = lines.filter(line => line.includes('[error]') || line.includes('[echo]'));
    socket.emit("getPcDirLogs", depuredLines);
    fs.writeFileSync(depuredLogPath, depuredLines.join('\n'));

    // Move uivision_log.txt to LogsHistory and rename it
    const newLogPath = path.join(logsHistoryDir, `${number}-${DD}_${MM}_${YYYY}-${HH}_${min}_${sec}-uivision_log.txt`);
    fs.renameSync(filePath, newLogPath);

    // Increment the number
    number++;

    // Write the new number back to the file
    fs.writeFileSync(numberFilePath, number.toString());
}