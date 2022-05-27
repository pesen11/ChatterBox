const socket = io();
const chatForm = document.getElementById("chat-form");
const chatPanel = document.querySelector(".chat-panel");
const roomName = document.getElementById("room-name");
const userNames = document.getElementById("users");

//Extract username and roomName from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);

//When a new user joins the chat
socket.emit("newUser", { username, room });

const outputMessage = (message) => {
  const newDiv = document.createElement("div");
  newDiv.classList.add("message");
  newDiv.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text-msg">${message.content} </p>`;
  document.querySelector(".chat-panel").appendChild(newDiv);
};

//Incoming msg from main app
socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  chatPanel.scrollTop = chatPanel.scrollHeight;
});

//To send the message

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //form vitra ko msg lai extract gareko with id
  const msg = e.target.elements.msg.value;
  //   console.log(msg);

  //Yeta baata chat ko msg pathaaxa. Need to catch it on the main app
  socket.emit("chatMsg", msg);

  //Clear the input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//For current room and its users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
  console.log(users);
});

//Displaying Room name

const outputRoomName = function (room) {
  roomName.innerText = room;
};

//Displaying list of current users

const outputUsers = function (users) {
  userNames.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join(" ")}`;
};
