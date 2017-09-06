// http://www.cnblogs.com/stoneniqiu/p/5402311.html
// https://www.npmjs.com/package/nodejs-websocket
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        console.log(message);
    });
});