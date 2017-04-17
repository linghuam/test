/*
*加载动画
*用法 new L.ICT.Control.Loading().addTo($div).show();
*/
define("control/loading",[
	"leaflet",
	"core/namespace"
],function(L){

	L.ICT.Control.Loading = L.Class.extend({

		initialize:function(){
			this._container = $('<div class="ict_control_loading"><span class="icon-loading"></span></div>');
		},

		addTo:function(pcontainer){
			pcontainer.prepend(this._container);
            var pwidth = pcontainer.outerWidth();
            var pheight = pcontainer.outerHeight();
			this._container.css({
				'position':'absolute',
				'top':0,
				'left':0,
				'width':pwidth +'px',
				'line-height':pheight +'px',
				'text-align':'center',
				'z-index':99999,
				'background-color':'#a9a6a6',
				'opacity':0.5,
				'overflow':'hidden',
				'display':'none'				
			});
			// this._container.find(".icon-loading").animate({
			// 	left:'+50px'
			// },'slow');
			// this._container.off('click dbclick');
			return this;
		},

		show:function(){
			this._container.css("display","block");
			return this;
		},

		hide:function(){
			this._container.css("display","none");
			return this;
		},

		remove:function(){
			this._container.remove();
			return this;
		}
	});
});