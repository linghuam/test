define("data/webSocket",["leaflet","core/namespace"],function(e){e.ICT.WebSocket=e.Class.extend({initialize:function(e){if(!window.WebSocket||!window.WebSocket.prototype.send)throw console.error("初始化websocket异常：您的浏览器不支持websocket！"),new Error("初始化websocket异常：您的浏览器不支持websocket！");this._websocket=new WebSocket(e),this._websocket.onclose=function(){console.log("websocketClose")}},send:function(e){typeof e=="object"&&(e=JSON.stringify(e)),this._websocket.send(e)},close:function(){this._websocket.close()},onMessage:function(e,t){this._websocket.onmessage=function(n){typeof e=="function"?e.call(t||this,n):null}},onError:function(e,t){this._websocket.onerror=function(n){typeof e=="function"?e.call(t||this,n):null}},getState:function(){return this._websocket.readyState}})});