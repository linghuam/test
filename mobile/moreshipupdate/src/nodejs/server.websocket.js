// http://www.cnblogs.com/stoneniqiu/p/5402311.html
// https://www.npmjs.com/package/nodejs-websocket
var request = require('request')
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        console.log('message');
        request('http://localhost:8088/src/data/1.json',function(error, response, body){
            // setInterval(function () {
                 console.log('send data!');
                 ws.send(body);
            // }, 1000);
        });
    });
});
