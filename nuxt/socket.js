import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import comManager from "./communicationManager";

let url;

url = import.meta.env.VITE_APP_SOCKET_URI;
// console.log("url", url);
url = "http://presound.daw.inspedralbes.cat:8080";

export const socket = io(url);

socket.on("connect", () => {
  const pinia = useAppStore();

  // getSongs();

  socket.on("voteCasted", (data) => {
    comManager.getSongs();
    comManager.getUserSelectedSongs(pinia.getUser().id);
    pinia.setIsLoadingVote({ state: false, selectedSong: null });
  });

  socket.on("songReported", (data) => {});

  socket.on("notifyServerResponse", (data) => {
    console.log("socket notifyServerResponse data received", data);
    pinia.setServerResponse(data);
  });

  socket.on("songDeleted", (data) => {
    console.log("socket songDeleted data received", data);
    comManager.getSongs();
    // comManager.getAdminSongs();
    refreshAdminSongsView(data.song);
  });

  socket.on("userBanned", (data) => {
    console.log("socket userBanned data received", data);
    refreshAdminUsersView(data);
  });

  socket.on("loginData", (id, mail, name, token, groups, roleId) => {
    pinia.setUser(id, mail, name, token, groups, roleId);
    console.log("loginData", id, mail, name, token, groups, roleId);
    if (pinia.getUser().groups.length > 0) {
      navigateTo({ path: "/llista_propostes" });
    } else {
      navigateTo({ path: "/escollirGrup" });
    }
  });

  socket.on("sendGroups", (data) => {
    pinia.setClassGroups(data);
  });

  socket.on("groupDeleted", (data) => {
    console.log("socket groupDeleted data received", data);
    pinia.deleteGroup(data.group_id);
  });

  socket.on("groupUpdated", (data) => {});

  socket.on("songPosted", (data) => {
    console.log("socket songPosted data", data);
    comManager.getSongs();
    comManager.getAdminSongs();
    pinia.setPostedSongStatus(data);
  });

  socket.on("postError", (data) => {
    console.log("socket postError data received", data);
    pinia.setPostedSongStatus(data);
  });

  socket.on("bellsGroupsRelationsUpdated", (data) => {
    console.log("socket bellsGroupsRelationsUpdated data received", data);
  });

  socket.on("updateBellsGroupsRelationsError", (data) => {
    console.log("socket updateBellsGroupsRelationsError data received", data);
  });

  socket.on("isReadReportStatusChanged", (data) => {
    console.log("socket isReadReportStatusChanged data received", data);
  });

  socket.on("userRoleUpdated", (data) => {
    refreshAdminUsersView(data);
  });

  socket.on("sendRoles", (data) => {
    pinia.setRoles(data);
    console.log("ROLES", data);
    pinia.setLoadingAdminComponent(false);
  });

  socket.on("sendSettings", (settings) => {
    if (settings != null) {
      pinia.setSettings(settings);
    }
  });

  socket.on("settingsUpdated", (settings) => {
    if (settings != null) {
      pinia.setSettings(settings);
    }
  });

  socket.on("votesDeleted", (data) => {
    console.log("socket votesDeleted data received", data);
    pinia.deleteCurrentTrackPlaying();
    pinia.deleteProposedSongs();
  });

  socket.on("disconnect", () => {});

  // FUNCTIONS START
  function getUserSelectedSongs(id) {
    fetch(`${url}/votingRecords/${id}`)
      .then((response) => response.json())
      .then((data) => {
        pinia.setUserSelectedSongs(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function getSongs() {
    fetch("${url}/songs")
      .then((response) => response.json())
      .then((data) => {
        pinia.setProposedSongs(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function getAdminSongs() {
    fetch("${url}/adminSongs")
      .then((response) => response.json())
      .then((data) => {
        pinia.setProposedSongsAdminView(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function refreshAdminUsersView(user) {
    let usersAdminView = pinia.getUsersAdminView();

    const i = usersAdminView.findIndex((u) => u.id === user.id);

    if (i !== -1) {
      usersAdminView[i] = user;
      pinia.setUsersAdminView(usersAdminView);
      refreshAdminSelectedUserView(user);
    } else {
      console.log("Not found in the array.");
    }
  }

  function refreshAdminSelectedUserView(user) {
    let selectedUser = pinia.getAdminSelectedUser();
    let usersAdminView = pinia.getUsersAdminView();

    if (selectedUser.id === user.id) {
      pinia.setAdminSelectedUser(user);
    } else {
      const i = usersAdminView.findIndex((u) => u.id === selectedUser.id);

      if (i !== -1) {
        pinia.setAdminSelectedUser(usersAdminView[i]);
      } else {
        console.log("Not found in the array.");
      }
    }
  }

  function refreshAdminSongsView(song) {
    let songsAdminView = pinia.getProposedSongsAdminView();

    const i = songsAdminView.findIndex((s) => s.id === song.id);

    if (i !== -1) {
      songsAdminView.splice(i, 1);
      pinia.setProposedSongsAdminView(songsAdminView);
      // refreshAdminSelectedSongView(song);
    } else {
      console.log("Not found in the array.");
    }
  }

  // function refreshAdminSelectedSongView(song) {

  //   let selectedSong = pinia.getAdminSelectedSong();
  //   let songsAdminView = pinia.getProposedSongsAdminView();

  //   if (selectedSong.id === song.id) {

  //     pinia.setAdminSelectedSong(song);

  //   } else {

  //     const i = songsAdminView.findIndex(s => s.id === selectedSong.id);

  //     if (i !== -1) {
  //       pinia.setAdminSelectedSong(songsAdminView[i]);
  //     } else {
  //       console.log("Not found in the array.");
  //     }
  //   }
  // }
});
