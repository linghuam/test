 export class MyWebSocket {

     constructor(url) {
         //判断浏览器是否支持
         if(!!window.WebSocket && window.WebSocket.prototype.send) {
             this._websocket = new WebSocket(url);
         } else {
             console.error('初始化websocket异常：您的浏览器不支持websocket！');
             throw new Error('初始化websocket异常：您的浏览器不支持websocket！');
         }

         this._websocket.onclose = function () {
             console.log("websocketClose");
         };
     }

     // CONNECTING 0   The connection is not yet open.
     // OPEN    1   The connection is open and ready to communicate.
     // CLOSING 2   The connection is in the process of closing.
     // CLOSED  3   The connection is closed or couldn't be opened.
     getState() {
         return this._websocket.readyState;
     }

     sendMessage(data) {
         if(typeof data === "object") {
             data = JSON.stringify(data);
         }
         if(this._websocket.readyState === 1) {
             this._websocket.send(data);
         }
     }

     onMessage(callback, context) {
         this._websocket.onmessage = function (event) {
             typeof callback === "function" ? callback.call(context || this, event) : null;
         }
     }

     onError(callback, context) {
         this._websocket.onerror = function (event) {
             typeof callback === "function" ? callback.call(context || this, event) : null;
         }
     }

     close() {
         this._websocket.close();
     }

 }
