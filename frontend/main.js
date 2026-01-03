const log = msg =>
  document.getElementById("log").textContent += msg + "\n";

const socket = io("https://YOUR_SERV00_DOMAIN", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  log("Connected to server");
});

document.getElementById("create").onclick = () => {
  socket.emit("createLobby");
};

document.getElementById("join").onclick = () => {
  const code = document.getElementById("code").value;
  socket.emit("joinLobby", code);
};

socket.on("lobbyCreated", code => {
  log("Lobby created: " + code);
});

socket.on("joinedLobby", code => {
  log("Joined lobby: " + code);
});

socket.on("errorMsg", msg => {
  log("Error: " + msg);
});
