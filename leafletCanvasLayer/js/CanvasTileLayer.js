(function(){
    
    /*
    * 参考http://www.marinetraffic.com/ 实现思路，
    * 将当前视图区域绘制成canvas切片，按照每个切片的范围加载船舶
    * 亲测：能承载2万个目标
    * 
    */
    L.CanvasTileLayer = L.TileLayer.extend({
        createTile: function(coords){
            // create a <canvas> element for drawing
            var tile = L.DomUtil.create('canvas', 'leaflet-tile');
            // setup tile width and height according to the options
            var size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            // get a canvas context and draw something on it using coords.x, coords.y and coords.z
            var ctx = tile.getContext('2d');

            // return the tile so it can be rendered on screen
            // for(var i=0;i<1000;i++){
                var url = 'img/target_1.png'; //10*22  
                var img = new Image();   // Create new img element
                img.onload = function(){
                    for(var i=0;i<22;i++){
                        for(var j=0;j<22;j++){
                            ctx.drawImage(img, i*10, j*22,10,22);   
                        }
                    }                    
                };
                img.src = url; // Set source path    

            // }

            // ctx.drawImage(img, 0, 0);
            return tile;
        }
    });

    L.canvastilelayer = function(url,options){
        return new  L.CanvasTileLayer(url,options);
    }

})();