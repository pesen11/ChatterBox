const socketio = require("socket.io");
const path = require("path");
const express = require("express");
const http = require("http");
const messageUtils = require("./utils/message");
const userUtils = require("./utils/users");

const app = express();

const server = http.createServer(app);

const io = socketio(server);

const adminName = "ChatterDoge";

//connection to static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connect", (socket) => {
  console.log("New connection detected.");

  socket.on("newUser", ({ username, room }) => {
    const user = userUtils.userInfo(socket.id, username, room);
    socket.join(user.room);

    //For user when user connects to the chat.
    socket.emit(
      "message",
      messageUtils.messageInfo(
        adminName,
        `Welcome ${username} hooman to ${room} chatterbox.`
      )
    );

    //Broadcast-broadcast to everyone except the user.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageUtils.messageInfo(adminName, `A wild ${username} has appeared.`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: userUtils.usersInRoom(user.room),
    });
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    const exitingUser = userUtils.userExit(socket.id);

    if (exitingUser) {
      // console.log(exitingUser);
      io.to(exitingUser.room).emit(
        "message",
        messageUtils.messageInfo(
          adminName,
          `${exitingUser.username} Hooman Left.`
        )
      );

      io.to(exitingUser.room).emit("roomUsers", {
        room: exitingUser.room,
        users: userUtils.usersInRoom(exitingUser.room),
      });
    }
  });

  //Listen for any incoming msg
  socket.on("chatMsg", (msg) => {
    const currentUser = userUtils.findUserById(socket.id);

    // console.log(msg);

    //Need to emit this msg to everybody on the chat.
    io.to(currentUser.room).emit(
      "message",
      messageUtils.messageInfo(currentUser.username, msg)
    );
  });
});
//Port connection
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
