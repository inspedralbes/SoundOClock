const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function downloadSongs(songs) {
  // Make sure the 'downloads' directory exists
  const downloadsDir = path.join(__dirname, 'downloads');
  fs.ensureDirSync(downloadsDir);

  // Create an array of promises for each song download
  const downloadPromises = songs.map(song => {
    return new Promise((resolve, reject) => {
      const url = song.preview_url;
      const fileName = `${song.bellId.toString().padStart(2, '0')}.mp3`;
      const filePath = path.join(downloadsDir, fileName);

      console.log("Downloading song", song.name, "from", url, "to", filePath);

      axios({
        method: 'get',
        url: url,
        responseType: 'stream'
      }).then(response => {
        const stream = response.data.pipe(fs.createWriteStream(filePath));
        stream.on('finish', () => {
          console.log(`${song.name} has been downloaded.`);
          resolve();  // Resolve the promise when the download is successful
        });
        stream.on('error', e => {
          console.error(`Error downloading ${song.name}:`, e);
          reject(e);  // Reject the promise if an error occurs
        });
      }).catch(error => {
        console.error(`Failed to download ${song.name}:`, error);
        reject(error);  // Reject the promise if an error occurs during the HTTP request
      });
    });
  });

  try {
    await Promise.all(downloadPromises);
    return true;  // Return true if all downloads succeed
  } catch (error) {
    return false;  // Return false if any download fails
  }
}

function getDownloadedSongs() {
  // Return a function that handles the request/response streaming
  return (req, res) => {  // Return an arrow function that takes req and res
    const downloadsDir = path.join(__dirname, 'downloads');

    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="downloaded_songs.zip"'
    });

    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
    });

    archive.on('error', function (err) {
      console.error('Archiver error:', err);
      res.status(500).send('Failed to zip files: ' + err.message);
    });

    archive.pipe(res);  // Pipe the archive data to the response

    archive.directory(downloadsDir, false);  // Append files from the downloads directory

    archive.finalize();  // Finalize the archive (this is where the archiving actually starts)
  };
}

const downloadsManager = {
  downloadSongs,
  getDownloadedSongs
}

module.exports = downloadsManager;