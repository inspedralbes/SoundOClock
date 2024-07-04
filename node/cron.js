import cron from "node-cron";
// import moment from 'moment';
import comManager from "./communicationManager.js";
import { VotingRecord } from "./models.js";

import mongoDBManager from "./mongoDB.manager.js";
import sqlDB_Manager from "./sqlDB.manager.js";

async function task(socket) {
  cron.schedule(
    "50 23 * * *",
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

async function mailReminder() {
  // Fetching settings from server
  const response = await comManager.getPublicSettings();
  const endVotingDate = response.end_vote;

  // Subtract two days to the last date of voting
  const mailSendingDate = new Date(endVotingDate);
  mailSendingDate.setDate(mailSendingDate.getDate() - 2);

  // Extract the date components for scheduling
  const month = String(mailSendingDate.getMonth() + 1).padStart(2, "0");
  const day = String(mailSendingDate.getDate()).padStart(2, "0");
  const hour = 0; // Adjust the hour as needed
  const minute = 0; // Adjust the minute as needed

  // Create the cron schedule string
  const cronString = `${minute} ${hour} ${day} ${month} *`;
  // Schedule the task
  cron.schedule(
    cronString,
    async () => {
      // GET THE USERS THAT ALREADY VOTED

      // Make a query to the mongo database to get all the voting records documents
      const usersVoted = await VotingRecord.find({});

      // Store in an array the IDs of the users that already voted
      let usersVotedId = [];
      for (let i = 0; i < usersVoted.length; i++) {
        if (usersVoted[i].votedSongs.length > 0) {
          usersVotedId.push(usersVoted[i].userId);
        }
      }

      console.log("Sending mail on", `${minute} ${hour} ${day} ${month} *`);
      const res = await comManager.sendVoteReminderMail(usersVotedId);
    },
    {
      scheduled: true,
      timezone: "Europe/Madrid",
    }
  );
}

async function clearDBs() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Clearing databases");
      try {
        await sqlDB_Manager.vaciarTablas();
        await mongoDBManager.vaciarAllCollections();
        console.log("Databases cleared successfully");
      } catch (error) {
        console.error("Error clearing databases:", error);
      }
    },
    {
      timezone: "Europe/Madrid",
    }
  );
}

const fetchingCron = {
  task,
  mailReminder,
  clearDBs,
};

export default fetchingCron;
