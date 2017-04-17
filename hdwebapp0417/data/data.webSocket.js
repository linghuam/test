define("data/webSocket",[
	"leaflet",
	"core/namespace"
 
],function(L){
   
    //websocket允许跨域，ajax默认不能跨域
    //一个页面只能new一个websocket，嵌入iframe也不行
    //改变端口号，一个页面可以建立多个websocket 即一个客户端（页面）只能建立一个跟服务器的通道
	L.ICT.WebSocket = L.Class.extend({
         
         initialize:function(url){
            //判断浏览器是否支持
            if (!!window.WebSocket && window.WebSocket.prototype.send){
                this._websocket = new WebSocket(url);  
            }else{
                console.error('初始化websocket异常：您的浏览器不支持websocket！');
                throw new Error('初始化websocket异常：您的浏览器不支持websocket！');       
            }

            this._websocket.onclose = function(){
                console.log("websocketClose");
            };                   
         },

         send:function(data){
         	if(typeof data === "object"){
         		data = JSON.stringify(data);
         	}
            this._websocket.send(data);
         },

         close:function(){
         	this._websocket.close();
         },

         onMessage:function(callback,context){
             this._websocket.onmessage = function(event){
                  typeof callback === "function" ? callback.call(context || this,event) : null;
             }
         },

         onError:function(callback,context){
            this._websocket.onerror = function(event){
                 typeof callback === "function" ? callback.call(context || this,event) : null;
            }
         },

         // CONNECTING 0   The connection is not yet open.
         // OPEN    1   The connection is open and ready to communicate.
         // CLOSING 2   The connection is in the process of closing.
         // CLOSED  3   The connection is closed or couldn't be opened.
         getState:function(){
            return this._websocket.readyState;
         }

	});

});