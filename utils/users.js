const users = [];

//Creating a new user object when user joins
exports.userInfo = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

//Used to get the current user by id
exports.findUserById = (id) => {
  return users.find((user) => user.id == id);
};

//Bichod

exports.userExit = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  //if findIndex cannot find the index for the element, returns -1.
  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0]; //Gives the user in the particular index
  }
};

exports.usersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};
