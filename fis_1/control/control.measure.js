/*
* 地图量测模块
*/
define("control/measure",[
    "leaflet",
    "leaflet/draw",
    "core/namespace"

],function(L){
    
    L.ICT = L.ICT || {};
    L.ICT.Measure = L.ICT.Measure || {};
    
    /* 测长度
     * 使用方法  new L.ICT.Measure.Length(L.ict.app.ictmap.map).enable();
     *L.GeometryUtil.readableDistance(distance, this.options.metric, this.options.feet, this.options.nautic);
    */
	L.ICT.Measure.Length = L.Draw.Polyline.extend({

	     options:{
	     	repeatMode:false,//绘完是否继续绘制
	     	icon: new L.DivIcon({ //顶点样式
				iconSize: new L.Point(8, 8),
				className: 'ict_measure_vetixicon'
			}),
			touchIcon: new L.DivIcon({
				iconSize: new L.Point(8, 8),
				className: 'ict_measure_vetixicon'
			}),			
			shapeOptions: { //线样式
				stroke: true,
				color: '#116cc1',
				weight: 2,
				opacity: 1,
				fill: false,
				clickable: true
			},	
			metric: false, // Whether to use the metric measurement system or imperial
			feet: false, // When not metric, to use feet instead of yards for display.
			nautic: true, // When not metric, not feet use nautic mile for display
			showLength: true,

			//自定义
			closeIcon: L.icon({
		              iconUrl: 'themes/images/shipIcons/hjxs_close.png',//icon图标的左上角对准latlng点
		              iconSize: [18, 18],   
		              iconAnchor: [-9, 14], //程序解析后变成margin-left:9px;margin-top:-14px;
		              className:'ict_measure_closeicon'
		     })

	     },

	     initialize:function(map,options){
	         L.Draw.Polyline.prototype.initialize.call(this, map, options);
	        
	     },

		// @method addHooks(): void  调用enable时调用它
		// Add's event listeners to this handler
		addHooks: function () {
	        // linghuam add
	        if(this._map){
	        	this.clear();
		        this._infomarkerGroup = new L.LayerGroup();
		        this._map.addLayer(this._infomarkerGroup);
		        this._measurelens = [];
		        this._closemarker = null;
	        }
			L.Draw.Polyline.prototype.addHooks.call(this);

		},

		// @method removeHooks(): void 调用disable时调用它
		// Removes event listeners from this handler
		removeHooks: function () {
			L.Draw.Feature.prototype.removeHooks.call(this);

			this._clearHideErrorTimeout();

			this._cleanUpShape();
	        
	        //linghuam delete
			// remove markers from map   
			// this._map.removeLayer(this._markerGroup);
			// delete this._markerGroup;
			// delete this._markers;

			// this._map.removeLayer(this._poly);
			// delete this._poly;

			this._mouseMarker
				.off('mousedown', this._onMouseDown, this)
				.off('mouseout', this._onMouseOut, this)
				.off('mouseup', this._onMouseUp, this)
				.off('mousemove', this._onMouseMove, this);
			this._map.removeLayer(this._mouseMarker);
			delete this._mouseMarker;

			// clean up DOM
			this._clearGuides();

			this._map
				.off('mouseup', this._onMouseUp, this)
				.off('mousemove', this._onMouseMove, this)
				.off('zoomlevelschange', this._onZoomEnd, this)
				.off('zoomend', this._onZoomEnd, this)
				.off('touchstart', this._onTouch, this)
				.off('click', this._onTouch, this);
		},

		_endPoint: function (clientX, clientY, e) {
			if (this._mouseDownOrigin) {
				var dragCheckDistance = L.point(clientX, clientY)
					.distanceTo(this._mouseDownOrigin);
				var lastPtDistance = this._calculateFinishDistance(e.latlng);
				var lastPtDistance2 = this._calculateFinishDistance2(e.latlng);
				//linghuam start
	            if(lastPtDistance !== Infinity && lastPtDistance2 !== Infinity){
	            	// var distance = e.latlng.distanceTo
	            	this._measurelens.push(lastPtDistance2);
	            }
	            //linghuam end

				//如果点击的是同一个点，则【停止绘制】
				if (lastPtDistance < 10 && L.Browser.touch) {
					this._finishShape();
					//linghuam start
					this._createCloseICon(e);
					//linghuam end

	            //如果不是同一个点，继续绘制
				} else if (Math.abs(dragCheckDistance) < 9 * (window.devicePixelRatio || 1)) {
					this.addVertex(e.latlng);
					//linghuam start
					this._createInfoICon(e);
					//linghuam end
				}
				this._enableNewMarkers(); // after a short pause, enable new markers
			}
			this._mouseDownOrigin = null;

		},   
         
         //linghuam amend
		_createMarker: function (latlng) {
			var lat =  L.ict.app.util.tool.latlngTodfmStr(latlng.lat,'lat');
			var lon =  L.ict.app.util.tool.latlngTodfmStr(latlng.lng,'lng');
			var title = '经度：'+lon +'，'+'纬度：'+lat;

			var marker = new L.Marker(latlng, {
				icon: this.options.icon,
				title:title,
				zIndexOffset: this.options.zIndexOffset * 2
			});
               
			this._markerGroup.addLayer(marker);

			return marker;
		},

        //linghuam  amend 计算结果以海里作为单位
		_calculateFinishDistance2: function (potentialLatLng) {
			var lastPtDistance;
			if (this._markers.length > 0) {
					var finishMarker;
					if (this.type === L.Draw.Polyline.TYPE) {
						finishMarker = this._markers[this._markers.length - 1];
					} else if (this.type === L.Draw.Polygon.TYPE) {
						finishMarker = this._markers[0];
					} else {
						return Infinity;
					}
					var lastMarkerPoint = finishMarker.getLatLng(),
					potentialMarker = new L.Marker(potentialLatLng, {
						icon: this.options.icon,
						zIndexOffset: this.options.zIndexOffset * 2
					});
					var potentialMarkerPint = potentialMarker.getLatLng();
					lastPtDistance = lastMarkerPoint.distanceTo(potentialMarkerPint);
					lastPtDistance = L.GeometryUtil.readableDistance(lastPtDistance, this.options.metric, this.options.feet, this.options.nautic);
				} else {
					lastPtDistance = Infinity;
				}
				return lastPtDistance;
		},		

		//linghuam  add
	    clear:function(){
			// remove markers from map
			if(this._markerGroup && this._markers){
			   this._map.removeLayer(this._markerGroup);
			   delete this._markerGroup;
			   delete this._markers;
			}

            if(this._poly){
               this._map.removeLayer(this._poly);
			   delete this._poly;
            }
            
            if(this._infomarkerGroup){
            	this._map.removeLayer(this._infomarkerGroup);
			    delete this._infomarkerGroup;
            }
            
            if(this._closemarker){
            	this._map.removeLayer(this._closemarker);
			    delete this._closemarker;
            }
                
			delete  this._measurelens;

	    },

	    //linghuam add
		_createInfoICon:function(e){
			  if(this._markers && this._markers.length <= 1){return ;}
	           var latlng = e.latlng;
	           var divIcon = L.divIcon({
	               iconSize:[100,20],
	              iconAnchor:[-2,-2],
	              className:'ict_measure_infoIcon',
	              html:this._getSum()+'海里'
	           });
	          var infomarker =  L.marker(latlng,{icon:divIcon});        
	          this._infomarkerGroup.addLayer(infomarker);

		},

		//linghuam add 
		_createCloseICon:function(e){
	          var latlng = e.latlng;
	          var closemarker = this._closemarker =  L.marker(latlng,{icon:this.options.closeIcon});
	          this._map.addLayer(closemarker);     
	          closemarker.on("click",function(){
	          	 this.clear();
	          },this);
	         
		},	

		//linghuam add
		_getSum:function(){
			var sum = 0;
			for(var i=0,len=this._measurelens.length;i<len;i++){
				 sum += parseFloat(this._measurelens[i]);
			}
			return sum.toFixed(2);
		}

	});
   
});