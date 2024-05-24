import { io } from "socket.io-client";
import { useAppStore } from "./stores/app";
import comManager from "./communicationManager";

let url;

url = import.meta.env.VITE_APP_SOCKET_URI;

export const socket = io({
  path: "/socket",
});

socket.on("connect", () => {
  const pinia = useAppStore();

  // getSongs();

  if (window.localStorage.getItem("user")) {
    pinia.setLoadingLogin(true);
    console.log("login in socket.js");
    let user = JSON.parse(window.localStorage.getItem("user"));
    console.log(user.email, user.name);
    socket.emit("login", user.email, user.name);
  }


  socket.on("voteCasted", (data) => {
    comManager.getSongs();
    comManager.getSortedVotedSongs();
    comManager.getUserSelectedSongs(pinia.getUser().id);
    pinia.setIsLoadingVote({ state: false, selectedSong: null });
  });

  socket.on("reportError", (data) => {
    pinia.setServerResponse(data);
  });

  socket.on("notifyServerResponse", (data) => {
    pinia.setServerResponse(data);
  });

  socket.on("songDeleted", (data) => {
    comManager.getSongs();
    comManager.getSortedVotedSongs();
    // comManager.getAdminSongs();
    refreshAdminSongsView(data.song);
  });

  socket.on("userBanned", (data) => {
    refreshAdminUsersView(data);
  });

  socket.on("loginData", (id, mail, name, picture, token, groups, roleId, roleName) => {
    console.log("loginData recived" + id + mail + name + picture + token + groups + roleId + roleName);
    pinia.setUser(id, mail, name, picture, token, groups, roleId, roleName);
    if (pinia.getUser().groups.length <= 0) {
      navigateTo({ path: "/escollirGrup" });
    }
    if (pinia.getLoadingLogin()) {
      pinia.setLoadingLogin(false);
    }
  });

  socket.on("sendGroups", (data) => {
    pinia.setClassGroups(data);
  });

  socket.on("groupDeleted", (data) => {
    pinia.deleteGroup(data.group_id);
  });

  socket.on("groupUpdated", (data) => { });

  socket.on("songPosted", (data) => {
    comManager.getSongs();
    comManager.getSortedVotedSongs();
    comManager.getAdminSongs();
    comManager.getUserSelectedSongs(pinia.getUser().id);
    pinia.setPostedSongStatus(data);
  });

  socket.on("postError", (data) => {
    pinia.setPostedSongStatus(data);
  });

  socket.on("bellsGroupsRelationsUpdated", (data) => { });

  socket.on("updateBellsGroupsRelationsError", (data) => { });

  socket.on("isReadReportStatusChanged", (data) => { });

  socket.on("userRoleUpdated", (data) => {
    refreshAdminUsersView(data);
  });

  socket.on("sendRoles", (data) => {
    pinia.setRoles(data);
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
    pinia.deleteCurrentTrackPlaying();
    pinia.deleteProposedSongs();
  });

  socket.on("userDeletedFromGroup", (data) => { });

  socket.on("disconnect", () => { });

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
      // console.log("Not found in the array.");
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
        // console.log("Not found in the array.");
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
      // console.log("Not found in the array.");
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
