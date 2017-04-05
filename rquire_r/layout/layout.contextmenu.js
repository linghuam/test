/*
*右键菜单
*/
define("layout/contextmenu",[
	"leaflet",
	"layout/base",
	"core/namespace"

],function(L){

      L.ICT.Layout.ContextMenu = L.ICT.Layout.extend({

      		initialize:function(){
				L.ICT.Layout.prototype.initialize.call(this);      				
      		}
      });
});