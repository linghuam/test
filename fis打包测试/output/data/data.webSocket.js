define("data/webSocket",["leaflet","core/namespace"],function(e){e.ICT.WebSocket=e.Class.extend({initialize:function(e){if(!window.WebSocket||!window.WebSocket.prototype.send)throw console.error("初始化websocket异常：您的浏览器不支持websocket！"),new Error("初始化websocket异常：您的浏览器不支持websocket！");this._websocket=new WebSocket(e),this._websocket.onclose=function(){console.log("websocketClose")},$(window).unload($.proxy(function(){this.close()},this))},send:function(e){"object"==typeof e&&(e=JSON.stringify(e)),this._websocket.send(e)},close:function(){this._websocket.close()},onMessage:function(e,o){this._websocket.onmessage=function(t){"function"==typeof e?e.call(o||this,t):null}},onError:function(e,o){this._websocket.onerror=function(t){"function"==typeof e?e.call(o||this,t):null}},getState:function(){return this._websocket.readyState}})});