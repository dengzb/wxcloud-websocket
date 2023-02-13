let { getResponse } = require("../proxy/chatbot.js");

function getMyTime(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours(), minutes = date.getMinutes();
    return `${hours >= 10 ? hours : '0' + hours}:${minutes > 10 ? minutes : '0' + minutes}`
}

exports.getReply = async (message, callback) => {
  let my = users[1];
  let friend = users[0];
  let timeStr = getMyTime(message.timestamp);
  global.messagePool.push({
      msgUserId: my.userId,//这条消息的拥有者是my
      msgUserName: my.nickName,
      msgUserHeadUrl: my.myHeadUrl,
      friendId: friend.userId,
      friendHeadUrl: friend.myHeadUrl,
      friendName: friend.nickName,
      timestamp: message.timestamp,
      timeStr: timeStr,
      duration: message.duration,
      content: message.content
  });
  let reply = await getResponse(my.userId, message.content);
  let replyMsg = {
    msgUserId: friend.userId,//这条消息的拥有者是my
    msgUserName: friend.nickName,
    msgUserHeadUrl: friend.myHeadUrl,
    friendId: my.userId,
    friendHeadUrl: my.myHeadUrl,
    friendName: my.nickName,
    timestamp: message.timestamp,
    timeStr: timeStr,
    duration: message.duration,
    content: reply.content
  };
  callback(replyMsg);
}
