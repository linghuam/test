/*
*将所有工具放入其中，外部只需通过这个类对象访问即可
*如果新增或删除了Util命名空间下的类，也要及时在这个类中新增或删除
*/
define("util/base",[
	"leaflet",
	"core/namespace",
	"util/dialog",
	"util/tool",
	"util/dateTime"
   
],function(L){

	L.ICT.Util.Base = L.Class.extend({

		dialog:null,

		tool:null,

		dateTime:null,

		initialize:function(){
			this.dialog = new  L.ICT.Util.Dialog();
			this.tool = new  L.ICT.Util.Tool();
			this.dateTime = new L.ICT.Util.DateTime();
		}

	});

	return L.ICT.Util.Base;
});