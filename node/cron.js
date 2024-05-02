import cron from "node-cron";
import comManager from "./communicationManager.js";

async function task(socket) {
  cron.schedule("0 0 * * *", async () => {
    const response = await comManager.getPublicSettings();
    socket.emit("sendSettings", response[0]);
  });
}

const fetchingCron = {
  task,
};

export default fetchingCron;
