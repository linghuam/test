/*
 *风险评估模块
 */
define("func/fxpg", [
    "leaflet",
    "func/base",
    "data/ajax",
    "control/panel",
    "control/paging",
    "plugins/mcscroll"

], function(L) {

    L.ICT.Func.add("FXPG", {

        Class: L.Class.extend({

            initialize: function() {
                this.ajax = new L.ICT.Ajax();
                this.ictmap = L.ict.app.ictmap;
                this.map = L.ict.app.ictmap.map;
                this.url = Project_ParamConfig.wjAnalysisConfig.fxpgUrl;
                this.menu = L.ict.app.menu;
                this.menuid = "ict_menu_main_xwwj";
                this.layer = null;
                this._layerGroup = null;
                this.data = null;
                this._container = null;
                this._popPanel = null;
                this.pagecount = 15;

            },

            start: function() {
                this.ajaxCount = 0;
                this.openPopPanel();
                var pageid = 1;
                this.getData(pageid);
                this.getAllData();
            },

            stop: function() {
                this.removeLayer();
                this.removePopPanel();
                this.data = null;
                this._container = null;
                // this.ajax.abort();
            },

            openPopPanel: function() {
                var options = {
                    title: '风险评估',
                    width: 660,
                    height: 410,
                    left: 340,
                    top: 160
                };
                options.contentHTML = this._container = $(this.getContentHtml());
                this._popPanel = new L.ICT.PopPanel(options);
                this._popPanel.show();
                this._popPanel.on("popPanelRemove", function() {
                    var $menuContainer = this.menu.getContainer();
                    var wjfxObj = L.ICT.Func["WJAnalysis"].getInstance();
                    $menuContainer.find(".submenu_wjanalysis  .submenu_li_fxpg").removeClass("active");
                    wjfxObj.removeLayer();
                    wjfxObj.removeHdycLayer();
                    L.ict.app.ictmap.OperateState.wjfx = false;
                    this.removeLayer();
                    this.data = null;
                    this._popPanel = null;
                    this._container = null;
                    // this.ajax.abort();
                }, this);

            },

            getContentHtml: function() {
                var html = [];
                html.push('<div class="fxpg_res_container">');
                html.push('<div class="fxpg_res_table_container">');
                html.push('<div class="thDiv">');
                html.push('<table>');
                html.push('<tr>');
                html.push('<th>批号</th>');
                html.push('<th>MMSI</th>');
                html.push('<th>船名</th>');
                html.push('<th style="width:20%">经度</th>');
                html.push('<th style="width:20%">纬度</th>');
                html.push('<th style="width:20%">更新时间</th>');
                html.push('<th>风险等级</th>');
                html.push('</tr>');
                html.push('</table>');
                html.push('</div>');
                html.push('<div class="tbDiv"></div>');
                html.push('</div>');
                html.push('<div class="fxpg_res_page_container">');
                html.push('</div>');
                html.push('</div>');
                return html.join("");

            },

            removeLayer: function() {
                // L.ict.app.util.tool.invoke(function(){
                if (this.layer) {
                    this.map.removeLayer(this.layer);
                    this.layer = null;
                }
                if (this._layerGroup) {
                    this.map.removeLayer(this._layerGroup);
                    this._layerGroup = null;
                }
                // }.bind(this),0,1000,60000);

            },

            removePopPanel: function() {
                if (this._popPanel) {
                    this._popPanel.remove();
                    this._popPanel = null;
                }

            },

            getData: function(pageid) {
                var url = this.url;
                var data = {
                    pageid: pageid,
                    pagecount: this.pagecount
                };
                this.ajax.post(url, data, true, this, function(res,error) {
                    this.ajaxCount++;
                    if(res){
                        if (res.state !== 1) {
                            console.log(res.state.msg);
                        } else {
                            this.data = res;
                            this.displayData();
                        }
                    }
                });

            },

            //获取所有数据，用于显示图层
            getAllData: function() {
                var url = this.url;
                var data = {
                    pageid: 1,
                    pagecount: 800
                };
                this.ajax.post(url, data, true, this, function(res) {
                    if(res){
                        if (res.state !== 1 || !this._popPanel) {
                            // console.log(res.state.msg);
                        } else {
                            this.displayAllData(res);
                        }
                    }
                });
            },

            displayAllData: function(res) {
                var shiplist = res.msg.shipList;
                var layers = [];
                for (var i = 0, len = shiplist.length; i < len; i++) {
                    var shipobj = shiplist[i];
                    var lyr = this.createShipMarker(shipobj);
                    layers.push(lyr);
                }
                this._layerGroup = L.featureGroup(layers).addTo(this.map);
            },

            displayData: function() {
                var data = this.data;
                var shiplist = data.msg.shipList;
                if (shiplist.length <= 0) return;
                var reshtml = [];
                reshtml.push('<div class="mscrollbar"><table>');
                for (var i = 0, len = shiplist.length; i < len; i++) {
                    var dataobj = shiplist[i];
                    var newobj = this.convertDataDisplay(dataobj);
                    reshtml.push('<tr data-id=' + newobj.ti + '>');
                    reshtml.push('<td>' + newobj.ti + '</td>');
                    reshtml.push('<td>' + newobj.msi + '</td>');
                    reshtml.push('<td>' + (newobj.sn.replace(/@/g, '') || '未知') + '</td>');
                    reshtml.push('<td style="width:20%">' + newobj.lon + '</td>');
                    reshtml.push('<td style="width:20%">' + newobj.lat + '</td>');
                    reshtml.push('<td style="width:20%">' + newobj.tim + '</td>');
                    reshtml.push('<td>' + newobj.lev + '</td>');
                    reshtml.push('</tr>');
                }
                reshtml.push('</table></div>');
                reshtml = reshtml.join("");
                var self = this;
                if (this.ajaxCount == 1) {
                    var total = data.msg.total, //总条数
                        pageCount = data.msg.max_page; //总页数
                    this._container.find(".fxpg_res_table_container>.tbDiv").html(reshtml);
                    //滚动
                    this._container.find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark" });
                    //注册表格单击事件
                    this._container.find(".tbDiv table tr").on("click", function(event) { self.clickRow(event); });
                    //分页
                    var options = {
                        total: pageCount,
                        count: 5,
                        present: 1
                    };

                    options.pageChange = function(index) {
                        self.getData(index);
                    };
                    var paging = new L.ICT.Control.Paging(options);
                    var pageContainer = this._container.find(".fxpg_res_page_container")[0];
                    paging.addTo(pageContainer);

                } else {
                    this._container.find(".fxpg_res_table_container>.tbDiv").html(reshtml);
                    this._container.find(".mscrollbar").mCustomScrollbar({ theme: "minimal-dark" });
                    this._container.find(".tbDiv table tr").on("click", function(event) { self.clickRow(event); });
                }

            },

            clickRow: function(e) {
                $(e.currentTarget).addClass("active").siblings().removeClass("active");
                var shipId = $(e.currentTarget).data("id");
                var shipobj = this.getShipObjById(shipId);
                if (this.layer) { this.map.removeLayer(this.layer); }
                var layer = this.layer = this.createShipMarker(shipobj);
                this.map.addLayer(layer);
                layer.openPopup();
                this.map.panTo(layer.getLatLng());

            },

            getShipObjById: function(id) {
                var shiplist = this.data.msg.shipList,
                    obj = {};
                for (var i = 0, len = shiplist.length; i < len; i++) {
                    if (shiplist[i].ti == id) {
                        obj = shiplist[i];
                        break;
                    }
                }
                return obj;

            },

            convertDataDisplay: function(dataobj) {
                var newobj = {};
                newobj.msi = dataobj.msi;
                newobj.ti = dataobj.ti;
                newobj.lev = dataobj.lev;
                newobj.sn = dataobj.sn;
                newobj.lon = L.ict.app.util.tool.latlngTodfmStr(dataobj.lon / 600000, "lng");
                newobj.lat = L.ict.app.util.tool.latlngTodfmStr(dataobj.lat / 600000, "lat");
                newobj.tim = L.ict.app.util.dateTime.getTimeStrFromUnix(dataobj.tim);
                return newobj;

            },

            createShipMarker: function(dataobj) {
                var latlng = L.latLng(dataobj.lat / 600000, dataobj.lon / 600000);
                var markerOptions = {
                    icon: L.ICT.ShipIcon.ship7,
                    // rotationAngle: roang,
                    data: dataobj
                };
                var marker = L.marker(latlng, markerOptions);

                var popup = this.createPopPanel(dataobj);
                marker.bindPopup(popup);
                return marker;

            },

            createPopPanel: function(dataobj) {
                var options = {
                    minWidth: 200,
                    maxWidth: 300
                };
                var popup = L.popup(options);
                var content = this.getPopPanelContent(dataobj);
                popup.setContent(content);
                return popup;

            },

            getPopPanelContent: function(dataobj) {
                var newobj = this.convertDataDisplay(dataobj);
                var html = [];
                html.push('<div style="padding:5px;">');
                html.push('<table>');
                html.push('<tr><td>批号：</td><td>' + newobj.ti + '</td></tr>');
                html.push('<tr><td>MMSI：</td><td>' + newobj.msi + '</td></tr>');
                html.push('<tr><td>船名：</td><td>' + (newobj.sn.replace(/@/g, '') || '未知') + '</td></tr>');
                html.push('<tr><td>经度：</td><td>' + newobj.lon + '</td></tr>');
                html.push('<tr><td>纬度：</td><td>' + newobj.lat + '</td></tr>');
                html.push('<tr><td>更新时间：</td><td>' + newobj.tim + '</td></tr>');
                html.push('<tr><td>风险等级：</td><td>' + newobj.lev + '</td></tr>');
                html.push('</table>');
                html.push('</div>');
                return html.join("");

            }

        })

    });


});
