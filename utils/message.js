const moment = require("moment");

exports.messageInfo = (username, content) => {
  return {
    username,
    content,
    time: moment().format("h:mm a"),
  };
};
