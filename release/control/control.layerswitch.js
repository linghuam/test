/*
*底图切换控件
*/

define("control/layerswitch",[
	"leaflet",
	"core/namespace"

],function(L){
  
   L.ICT.Control.LayerSwitch = L.Control.extend({

       includes:L.Mixin.Events,
       
       initialize:function(options){
          L.setOptions(this,options);
          this.changeLayers = Project_ParamConfig.changeLayers;
       },

       onAdd:function(map){
         this._map = map;
       	 this._initLayout();
       	 this._initEvts();    
         return this._container;
       },

       onRemove:function(map){

       },

       getBaseLayerById:function(layerid){
          for(var i=0;i<this.changeLayers.length;i++){
            if(this.changeLayers[i].id == layerid){
              return this.changeLayers[i].layer;
            }
          }
       },

       hideAllBaseLayer:function(){
          for(var i=0;i<this.changeLayers.length;i++){
             var layer = this.changeLayers[i].layer;
             layer.setOpacity(0);
          }         
       },

       showBaseLayer:function(layerid){
           var curLayer = this.getBaseLayerById(layerid);
           if(curLayer.options.opacity === 0){
              this.hideAllBaseLayer();
              curLayer.setOpacity(1);
              this.fire("baseLayerChangeEvent",{curBaseLayer:curLayer});
           }
       },

       _initLayout:function(){
       	  var className = 'ict-leaflet-control-layers',
       	      container = this._container = L.DomUtil.create('div',className),
              innerhtml = [];
          innerhtml.push('<ul>');
          for(var i=0,len=this.changeLayers.length;i<len;i++){
            if(this.changeLayers[i].active){
               if(Project_ParamConfig.lang === 'zh') {innerhtml.push('<li class="active" data-id="'+this.changeLayers[i].id+'"><a>'+this.changeLayers[i].name+'</a></li>');}
               else {innerhtml.push('<li class="active" data-id="'+this.changeLayers[i].id+'"><a>'+this.changeLayers[i].name_en+'</a></li>');}
            } else {
               if(Project_ParamConfig.lang === 'zh') {innerhtml.push('<li data-id="'+this.changeLayers[i].id+'"><a>'+this.changeLayers[i].name+'</a></li>');}
               else {innerhtml.push('<li data-id="'+this.changeLayers[i].id+'"><a>'+this.changeLayers[i].name_en+'</a></li>');}
            }
              
          }
          innerhtml.push('</ul>');
          innerhtml = innerhtml.join("");
          container.innerHTML = innerhtml;
       	  
       },

       _initEvts:function(){
          var self = this;
          $(this._container).find("ul>li").on("click",function(event){
             event.stopPropagation();
             $(this).addClass("active").siblings().removeClass("active");
             var layerid = $(this).data("id");
             self.showBaseLayer(layerid);
          });
       }

   });

});