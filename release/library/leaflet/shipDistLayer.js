/*
*绿点图
*/
define("leaflet/shipDistLayer",["leaflet"],function(L){

    L.TileLayer.ShipDistLayer = L.TileLayer.extend({

        initialize:function(url,options){
           L.setOptions(this,options);
           this._url = url + "{s}/{z}-{x}-{y}.png";
           L.TileLayer.prototype.initialize.call(this,this._url,this.options);
        },

        getTileUrl:function(tilePoint){
            return L.Util.template(this._url, L.extend({  
                s: function() {  
                var dir;
                   if (tilePoint.z > 6)
                {
                    var aa=Math.pow(2, tilePoint.z - 5);
                    var rowDir="R" + Math.floor(tilePoint.y / aa);
                    var colDir="C" + Math.floor(tilePoint.x / aa);
                    dir=tilePoint.z + "/" + rowDir + "/" + colDir ;
                }
                else
                {
                    dir=tilePoint.z;
                }
                return dir;
                },  
                z:tilePoint.z,  
                x:tilePoint.x,  
                y:tilePoint.y  
            }));             
        }
    });

    L.tileLayer.shipDistLayer = function(url,options){
       return new L.TileLayer.ShipDistLayer(url,options);
    };
});