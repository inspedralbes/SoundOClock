import cron from "node-cron";
import comManager from "./communicationManager.js";

async function task(socket) {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Fetching settings from server");
      const response = await comManager.getPublicSettings();
      io.emit("sendSettings", response);
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
