/*
*产品订阅模块
*/

define("func/productSub",[
	"leaflet",
	"func/base",
	"data/ajax",
  "control/panel",
  "control/playback"

],function(L){

L.ICT.Func.add("ProductSub",{

  Class:L.Class.extend({

      id:'ProductSub',
       
      initialize:function(){
          // L.ict.app.pool = new L.ICT.Pool();
          // var mapClass = new L.ICT.Map(mymap);
          // L.ict.app.pool.add(mapClass,'map');
          // this.ictMap = L.ict.app.pool.get("map");
          // var slice = Array.prototype.slice;
          // var args = slice.call(arguments, 0);
          //   for (var i in arguments[0]) {
          //    var m = arguments[0][i];
          //   }
          // var a1 = arguments[0];
          this._container = this._popPanel = null;
          this._playback = null;
          this.ajax = new L.ICT.Ajax();
          // this.dialog =  new parent.L.ICT.Dialog();
          this.dialog =  L.ict.app.util.dialog;
          this._map = L.ict.app.ictmap.map;

       },

       start:function(){  
          if(this._container || this._popPanel) return;       
          this._initUi();
          this._initEvts();
          this._container.find(".productNav>li:first-child>a").click();

       },

       stop:function(){
          this.ajax.abort();
          this._popPanel.remove();
          this._container = this._popPanel = null;
       },

       getContentHtml:function(){
          var html = [];
          html.push('<div class="productSubsContainer">');
          html.push('<ul class="nav productNav">');
          html.push('<li class="active" data-info="productList"><a href="#" >产品列表</a></li>');
          html.push('<li data-info="subscribeList"><a href="#" >订阅列表</a></li>');
          html.push('</ul>');
          html.push('<div class="listDiv"></div>');
          html.push('</div>');
          return html.join("");

       },
       
       getProductList:function(data){
            var html = [];  
            html.push('<div>'); 
            html.push('<table>');
            html.push('<thead>');
            html.push('<tr>');
            html.push('<th>区域名称</th>');
            html.push('<th>时间范围</th>');
            html.push('<th>信息模式</th>');
            html.push('<th>信息源</th>');
            html.push('<th>目标匹数</th>');
            html.push('<th>目标点数</th>');
            html.push('<th>操作</th>');
            html.push('<th>状态</th>');
            html.push('</tr>');
            html.push('</thead>');
            html.push('<tbody>');
            for(var i=0,len=16;i<len;i++){
              if(i%2 === 0){
                  html.push('<tr>');
                  // html.push('<td>区域一<div><img src="images/model/frame/test.png"></div></td>');
                  html.push('<td>区域一<button class="locatBtn" type="button"></button></td>');              
                  html.push('<td>2016-10-27 16:00——2016-10-30 16:00</td>');
                  html.push('<td>原始模式</td>');
                  html.push('<td>北斗</td>');
                  html.push('<td>16</td>');
                  html.push('<td>16</td>');
                  html.push('<td><button class="subBtn active" type="button" data-info="1">订阅</button></td>');
                  html.push('<td>已订阅</td>');
                  html.push('</tr>');
              }else {
                  html.push('<tr>');
                  // html.push('<td>区域一<div><img src="images/model/frame/test.png"></div></td>');
                  html.push('<td>区域一<button class="locatBtn" type="button"></button></td>');              
                  html.push('<td>2016-10-27 16:00——2016-10-30 16:00</td>');
                  html.push('<td>原始模式</td>');
                  html.push('<td>北斗</td>');
                  html.push('<td>16</td>');
                  html.push('<td>16</td>');
                  html.push('<td><button class="subBtn" type="button" data-info="0">订阅</button></td>');
                  html.push('<td>未订阅</td>');
                  html.push('</tr>');
              }
            }
            html.push('</tbody>');
            html.push('</table>');
            html.push('</div>');
            return html.join("");   

       },

       getSubScribleList:function(data){
            var html = []; 
            html.push('<div>');            
            html.push('<table>');
            html.push('<thead>');
            html.push('<tr>');
            html.push('<th>区域名称</th>');
            html.push('<th>时间范围</th>');
            html.push('<th>信息模式</th>');
            html.push('<th>信息源</th>');
            html.push('<th>操作</th>');
            html.push('</tr>');
            html.push('</thead>');
            html.push('<tbody>');
            for(var i=0,len=6;i<len;i++){
              html.push('<tr>');
              html.push('<td>区域一<button class="locatBtn" type="button"></button></td>');
              html.push('<td>2016-10-27 16:00——2016-10-30 16:00</td>');
              html.push('<td>原始模式</td>');
              html.push('<td>北斗</td>');
              html.push('<td><button class="viewBtn" type="button">查看</button></td>');
              html.push('</tr>');
            }
            html.push('</tbody>');
            html.push('</table>');
            html.push('</div>');            
            return html.join("");  

       },

       _initUi:function(){
           var options = {
           	  title:'产品订阅',
           	  width:910,
           	  height:458,
           	  left:200,
           	  top:200
           };
           var content = this._container =  $(this.getContentHtml());
           options.contentHTML = content;
           var pop = new L.ICT.PopPanel(options);
           pop.show();
           this._popPanel = pop;  
           this._popPanel.on("popPanelRemove",function(){
           	  this.stop();
           },this);      
       },

       _initEvts:function(){
          this._container.find("ul>li").on("click",{context:this},this._changeNavEvt);          
       },

       _changeNavEvt:function(e){
           var _this = e.data.context;
           var type = $(this).data("info");
           $(this).addClass("active").siblings().removeClass("active");
           if(type === "productList"){
              //停止之前请求
              //请求后台数据
              //更新表格
              _this._container.find(".listDiv").html(_this.getProductList()).find("div").mCustomScrollbar({ theme: "minimal-dark" });              
              
           }else if(type === "subscribeList"){
              //停止之前请求
              //请求后台数据
              //更新表格
              _this._container.find(".listDiv").html(_this.getSubScribleList()).find("div").mCustomScrollbar({ theme: "minimal-dark" });
           }else {

           }
           //注册表格事件
           _this._tableEvts();
           return;

       },

      _tableEvts:function(){
           var _this = this;
           //定位
           _this._container.find(".listDiv table .locatBtn").on("click",function(e){
             e.preventDefault();
             var southWest = L.latLng(40.712, -74.227),
                northEast = L.latLng(40.774, -74.125),
                bounds = L.latLngBounds(southWest, northEast);
              // _this._map.fitBounds(bounds);
              var zoom = _this._map.getZoom() > 8 ?  _this._map.getZoom()-1 : _this._map.getZoom()+1;
              _this._map.setView([30,114],zoom);
             return;
           });
           //订阅
           _this._container.find(".listDiv table .subBtn").on("click",function(e){
                var type = $(this).data("info");
                if(type == "0"){ //未订阅
                  $(this).addClass("active");
                  $(this).parent().next().html("已订阅");
                  $(this).data("info","1");
                  
                }else{ //已订阅
                  
                }
                return;
           });
           //查看
           _this._container.find(".listDiv table .viewBtn").on("click",function(e){
              // test();
              _this.playback();
              return;
           });

      },

      playback:function(){
      	    if(this._playback){
      	    	this._playback.close();
      	    	this._playback = null;
      	    }
            var data = {
				    "state": 1,
				    "msg": {
				        "shipList": [
				            {
				                "maxTime": 1478767907,
				                "minTime": 1478767902,
				                "mode": 0,
				                "num": 41249,
				                "posList": [
				                   {"co":290,"he":29,"la":18462079,"lo":73132395,"sp":23,"ti":1467520200},
				                   {"co":290,"he":29,"la":18462079,"lo":72352395,"sp":23,"ti":1467556200},
				                   {"co":290,"he":29,"la":18762079,"lo":71932395,"sp":23,"ti":1467592200},
				                   {"co":290,"he":29,"la":19122079,"lo":71392395,"sp":23,"ti":1467628200}
				                ]

				            },
				            {
				                "maxTime": 1478767907,
				                "minTime": 1478767902,
				                "mode": 0,
				                "num": 41248,
				                "posList": [
				                  {"co":290,"he":29,"la":18762079,"lo":73732395,"sp":23,"ti":1467520200},
				                  {"co":290,"he":29,"la":18762079,"lo":72952395,"sp":23,"ti":1467556200},
				                  {"co":290,"he":29,"la":19062079,"lo":72532395,"sp":23,"ti":1467592200},
				                  {"co":290,"he":29,"la":19422079,"lo":71992395,"sp":23,"ti":1467628200}
				                ]
				            }
				        ]
				    }
				};
              data = data.msg.shipList;
              this._playback = new L.ICT.Control.PlayBack (data,null,function(){},null).show(this._map);
      }  
  })

});

});