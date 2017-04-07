        //添加栅格图
        addRasterLayer:function(){
            this.removeRasterLayer();
            // var url = this.config.rasterUrl;
            var url = './documents/data.json';
            this.ajax.get(url,null,true,this,function(res){
                 if(res.state !== 1){
                      console.error(res.msg.error);
                 }else{
                      this._rasterLayer = L.featureGroup([]);
                      this.ictmap.map.addLayer(this._rasterLayer); 
                      this.makeGrid(res.msg.data);
                      if(this._curDistType !== '2' || this.ictmap.map.getZoom() >= this.config.showLevel){
                          // this.hideRasterLayer();
                      }
                 }
            },function(e){
                console.error(e);
            });               
        },

        makeGrid:function(data){
            for(var i=0,len=data.length;i<len;i++){
                var obj = data[i];
                var newlat = obj.lat;
                var newlon = obj.lon;
                if(newlat > 90-1){
                    newlat = 90-1;
                }
                if(newlon > 180-1){
                    newlon = 180-1;
                }
                var sw = L.latLng(newlat,newlon);
                var ne = L.latLng(newlat+1,newlon+1);
                var bounds = L.latLngBounds(sw,ne);
                var rect = L.rectangle(bounds);
                this._rasterLayer.addLayer(rect);
            }

        }

