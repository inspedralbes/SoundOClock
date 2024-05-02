import cron from "node-cron";
import comManager from "./communicationManager.js";

async function task(socket) {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Fetching settings from server");
      const response = await comManager.getPublicSettings();
      socket.emit("sendSettings", response[0]);
    },
    {
      timezone: "Europe/Madrid",
    }
  );
}

const fetchingCron = {
  task,
};

export default fetchingCron;
