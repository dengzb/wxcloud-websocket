const express = require('express')
const app = express()
require('express-ws')(app)
let {getReply} = require('./handler/messageHandler.js')

const connect = {};
global.messagePool = [];

global.users = [{
            userId: 'user_001',
            nickName: '柳如月',
            myHeadUrl: 'http://downza.img.zz314.com/edu/pc/wlgj-1008/2016-06-23/64ec0888b15773e3ba5b5f744b9df16c.jpg'
        }, {
            userId: 'user_002',
            nickName: '李恺新',
            myHeadUrl: 'http://tx.haiqq.com/uploads/allimg/170504/0641415410-1.jpg'
        }];

app.get('/', function (req, res) {
  res.send('微信云托管WEBSOCKET服务')
})

app.ws('/ws', function (ws, req) {
  console.log('收到连接请求');
  let openid = req.headers['x-wx-openid'] // 从header中获取用户openid信息
  if (openid == null) { // 如果不存在则不是微信侧发起的
    openid = new Date().getTime() // 使用时间戳代替
  }
  connect[openid] = { // 记录用户信息
    openid: openid, // 用户openid
    source: req.headers['x-wx-source'] || '非微信', // 用户微信来源
    unionid: req.headers['x-wx-unionid'] || '-', // 用户unionid
    ip: req.headers['x-forwarded-for'] || '未知', // 用户所在ip地址
  }
  console.log('链接请求头信息', req.headers);
  // 返回登陆信息
  ws.send(JSON.stringify({type: 'login', userInfo: users[0]}));
  ws.on('close', function () {
    console.log('链接断开：', openid)
    delete connect[openid]
  });
  ws.on('message', (msg) => {
      console.log("收到消息", msg);
      const message = JSON.parse(msg);
      if (message.type === 'ping') {
        ws.send(JSON.stringify({type:'pong'}));
      } else {
        getReply(message, (reply) => {
          let {type, content, friendId, duration, timestamp} = reply;
          ws.send(JSON.stringify({type, content, duration, timestamp}));
          global.messagePool.push(reply);
        })
      }
  });
})

const server = app.listen(80, function () {
  console.log('微信云托管WEBSOCKET服务启动成功！')
});

process.on('SIGTERM', () => {
  console.log('SIGTERM 系统终止信号收到，关闭服务器')
  server.close(() => {
    console.log('服务关闭成功')
  })
})
