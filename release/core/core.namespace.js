
define("core/namespace",[	
	"leaflet"

],function(L){

	/*定义全局命名空间*/
	window.L = window.L || {};

	L.ICT= L.ICT || {};  
	L.ict= L.ict || {};
    
    L.ICT.App = L.ict.app  = L.ICT.App || {}; //app命名空间

	L.ICT.Func = L.ICT.Func || {}; //功能类命名空间
	L.ICT.Util = L.ICT.Util || {}; //工具类命名空间
	L.ICT.Control = L.ICT.Control || {};//控件类命名空间
	
});
