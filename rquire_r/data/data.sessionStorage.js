define("data/sessionStorage",[
	"leaflet",
    "core/namespace"
    
],function(L){
  
  L.ICT.SessionStorage = L.Class.extend({
     
     initialize:function(){
        
        //兼容低版本浏览器
        //如果没有localStorage，用cookie来模拟
        //了解更多：https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
        if (!window.sessionStorage) {
			window.sessionStorage = {
				    getItem: function (sKey) {
				      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
				      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
				    },
				    key: function (nKeyId) {
				      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
				    },
				    setItem: function (sKey, sValue) {
				      if(!sKey) { return; }
				      document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
				      this.length = document.cookie.match(/\=/g).length;
				    },
				    length: 0,
				    removeItem: function (sKey) {
				      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
				      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				      this.length--;
				    },
				    hasOwnProperty: function (sKey) {
				      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
				    }
            };
            window.sessionStorage.length = (document.cookie.match(/\=/g) || window.sessionStorage).length;
        }
     },

     getItem:function(key){
        var value = window.sessionStorage.getItem(key);
        if(value !== null){
        	try{
        		value = JSON.parse(value);
        	} catch(e){
                return value;
        	}
        }
        return value;
     },

     setItem:function(key,value){
         if(typeof value === "object"){
         	value = JSON.stringify(value);
         }

         return  window.sessionStorage.setItem(key,value);
     },
     
     removeItem:function(key){        
        return window.sessionStorage.removeItem(key);
     },

     getLength:function(){
        return window.sessionStorage.length;
     },

     clear:function(){
       return window.sessionStorage.clear();
     }

  });

});