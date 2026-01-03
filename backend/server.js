import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }
});

const lobbies = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on("connection", socket => {
  socket.on("createLobby", () => {
    const code = generateCode();
    lobbies[code] = { players: [socket.id] };
    socket.join(code);
    socket.emit("lobbyCreated", code);
  });

  socket.on("joinLobby", code => {
    if (!lobbies[code]) {
      socket.emit("errorMsg", "Lobby not found");
      return;
    }
    lobbies[code].players.push(socket.id);
    socket.join(code);
    socket.emit("joinedLobby", code);
  });

  socket.on("disconnect", () => {
    for (const code in lobbies) {
      lobbies[code].players =
        lobbies[code].players.filter(id => id !== socket.id);
      if (lobbies[code].players.length === 0) {
        delete lobbies[code];
      }
    }
  });
});

server.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
