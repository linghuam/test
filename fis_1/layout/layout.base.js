define("layout/base",[
	"leaflet",
	"core/baseobject",
    "core/namespace"
    
],function(L){
  
	/*
	*布局类
	*/
	L.ICT.Layout = L.ICT.BaseObject.extend({

		visible:true,

		_container:null,

		initialize:function(){
			L.ICT.BaseObject.prototype.initialize.call(this);
		},

		setVisible:function(visible){
	       this.visible = visible;
	       if(visible)
	       	 this._container.css("display","block");
	       	else 
	       	  this._container.css("display","none");
		},

		getContainer:function(){
            return this._container;
		}
	});

});