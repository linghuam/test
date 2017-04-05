/**
 * Created by Administrator on 2017/03/15.
 * 调用方法：在layout.menu.js 中的 ict_menu_main_hyqx 菜单中暂时是先写的这个调用
 var  cdglshipadd=new L.ICT.CdglAddShip();
 cdglshipadd.addShipToFleet(cdglshipadd,30,"3401",413476350);
 */
define("func/cdgladdship",[
    "leaflet",
    "func/base",
    "control/panel",
    "plugins/mcscroll",
    "plugins/my97DatePicker",
    "data/ajax",
    "layout/menu"

],function(L){

    L.ICT.CdglAddShip = L.ICT.BaseObject.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.util = L.ict.app.util;
                this.dateUtil = L.ict.app.util.dateTime;
                this.ajax = new L.ICT.Ajax();
                this.config = Project_ParamConfig.cdglConfig;

                this._popPanelNotShipFleetMsg = null;//没有船队消息框
                this._popPanelShipFleetSelect = null;//选择船队对话框

                this.shipid="";
                this.shipname="";
                this.mmsi="";
                this.fleetlist=[];
            },

            getLoginUserId:function () {
                if (L.ict.app.sessionStorage.getItem("userInfo")!=null){
                    var user=L.ict.app.sessionStorage.getItem("userInfo");
                    return user.userId;
                }else{
                    return "";
                }
            },
            convertStrToAry:function (info) {
                var strary=info.split("$");
                var ary=[];
                for (var i=0;i<strary.length;i++){
                    var oneinfo=strary[i];
                    var oneary=oneinfo.split("|");
                    var oneobj={};
                    oneobj.id=oneary[0];
                    oneobj.name=oneary[1];
                    ary.push(oneobj);
                }
                return ary;
            },
            addShipToFleet:function (thisInstance,shipid,shipname,mmsi) {
                this.shipid=shipid;
                this.shipname=shipname;
                this.mmsi=mmsi;
                var url = this.config.getShipFleetUrl;
                var data={};
                data.user_id=this.getLoginUserId();
                this.ajax.post(url,data,true,this,function(res){
                    if (res.ret!=null && res.ret!=""){
                        this.fleetlist=this.convertStrToAry(res.ret);
                        if (this.fleetlist!=null && this.fleetlist.length>0){
                            this.dialogShowFleetList(thisInstance);
                        }else{
                            this.dialogShowNoFleet(thisInstance);
                        }
                    }else{
                        this.dialogShowNoFleet(thisInstance);
                    }
                },function(res){
                    var func_cdgl_error_msg_getFleetInfo=$.i18n.prop('func_cdgl_error_msg_getFleetInfo');
                    this._showErrorMsg(func_cdgl_error_msg_getFleetInfo);
                });
            },

            dialogShowFleetList:function (thisInstance) {
                var func_cdgladdship_titlename_addship=$.i18n.prop('func_cdgladdship_titlename_addship');
                var options = {
                    title:func_cdgladdship_titlename_addship,
                    width:410,
                    height:150,
                    top:200,
                    left:450,
                    contentHTML:this._getContentHtmlDialogShowFleetList()
                };
                var pop = this._popPanelShipFleetSelect = new L.ICT.PopPanel(options);
                pop.show();

                $("#dialogShipFleetSelect").empty();
                for (var i=0;i<this.fleetlist.length;i++){
                    $("#dialogShipFleetSelect").append("<option value='"+this.fleetlist[i].id+"'>"+this.fleetlist[i].name+"</option>");
                }

                setTimeout(this._bindBtnClickForAddShip(thisInstance),1000);

                this._popPanelShipFleetSelect.on("popPanelRemove",function(){
                    this._popPanelShipFleetSelect = null;
                },this);
            },
            _bindBtnClickForAddShip:function (thisInstance) {
                var benok = $("#dialogShipAddEditBtnOk");
                benok.bind("click", function(){thisInstance._dialogShipFleetSelectBtnClickOk();});

                var bencancel = $("#dialogShipAddEditBtnCancel");
                bencancel.bind("click", function(){thisInstance._dialogShipFleetSelectBtnClickCancel();});
            },
            _getContentHtmlDialogShowFleetList:function () {
                var func_cdgl_editship_fleetname=$.i18n.prop('func_cdgl_editship_fleetname');
                var common_btn_ok=$.i18n.prop('common_btn_ok');
                var common_btn_cancel=$.i18n.prop('common_btn_cancel');
                var html = [];
                html.push('<TABLE border=0 style="width:390px;height:70px;">');
                html.push('	<TR>');
                html.push('		<TD style="width:95px;height:30px;text-align:right;vertical-align:middle;">');
                html.push('			<label class="cdgl_labelfont">'+func_cdgl_editship_fleetname+'</label>');
                html.push('		</TD>');
                html.push('		<TD style="width:295px;height:30px;text-align:left;vertical-align:middle;">');
                html.push('			<select id="dialogShipFleetSelect" class="cdgl_labelfont" style="width:275px"></select>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD width=390px height="58px";align=center valign=center padding-left:60px; colspan="2">');
                html.push('		    <table style="height:100%;width:100%">');
                html.push('						<tr style="height:100%;width:100%">');
                html.push('									<td style="height:100%;width:100%;padding-left:135px;">');
                html.push('										<div id="dialogShipAddEditBtnOk" class="cdgl_dialog_btn_ok_cancel">'+common_btn_ok+'</div>');
                html.push('									</td>');
                //html.push('									<td style="height:100%;width:50%;padding-left:20px;">');
                //html.push('										<div id="dialogShipAddEditBtnCancel" class="cdgl_dialog_btn_ok_cancel">'+common_btn_cancel+'</div>');
                //html.push('									</td>');
                html.push('						</tr>');
                html.push('			</table>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            _dialogShipFleetSelectBtnClickCancel:function () {
                if(this._popPanelShipFleetSelect) this._popPanelShipFleetSelect.remove();
                this._popPanelShipFleetSelect=null;
            },
            _dialogShipFleetSelectBtnClickOk:function () {
                var selectid=$('#dialogShipFleetSelect option:selected').val();
                if (selectid==""){
                    var func_cdgl_editship_tip_selectfleet=$.i18n.prop('func_cdgl_editship_tip_selectfleet');
                    this._showErrorMsg(func_cdgl_editship_tip_selectfleet);
                    return;
                }
                var data = {};
                data.shipfleetid=selectid;
                data.shipid=this.shipid;
                data.shipname=this.shipname;
                data.mmsi=this.mmsi;
                var url = this.config.saveShipForAddUrl;
                this.ajax.post(url,data,true,this,function(res){
                    if(res.state!=1){
                        var func_cdgl_msg_tip_save_failed=$.i18n.prop('func_cdgl_msg_tip_save_failed');
                        this._showErrorMsg(func_cdgl_msg_tip_save_failed);
                    }else{
                        var func_cdgl_msg_tip_save_sucess=$.i18n.prop('func_cdgl_msg_tip_save_sucess');
                        //this._showMsg(func_cdgl_msg_tip_save_sucess);
                    }
                },function(res){
                    var func_cdgl_msg_tip_save_failed=$.i18n.prop('func_cdgl_msg_tip_save_failed');
                    this._showErrorMsg(func_cdgl_msg_tip_save_failed);
                });

                this._dialogShipFleetSelectBtnClickCancel();
            },

            dialogShowNoFleet:function (thisInstance) {
                var options = {
                    title:"",
                    width:410,
                    height:150,
                    top:200,
                    left:450,
                    contentHTML:this._getContentHtmlDialogNoFleet()
                };
                var pop = this._popPanelNotShipFleetMsg = new L.ICT.PopPanel(options);
                pop.show();

                setTimeout(this._bindBtnClickForNoFleet(thisInstance),1000);

                this._popPanelNotShipFleetMsg.on("popPanelRemove",function(){
                    this._popPanelNotShipFleetMsg = null;
                },this);
            },
            _bindBtnClickForNoFleet:function (thisInstance) {
                var ashipfleetadd = $("#dialogNoFleetShowFleetManagerA");
                ashipfleetadd.bind("click", function(){thisInstance._dialogNoFleetAClick();});
            },
            _getContentHtmlDialogNoFleet:function () {
                var func_cdgladdship_nofleettip1=$.i18n.prop('func_cdgladdship_nofleettip1');
                var func_cdgladdship_nofleettip2=$.i18n.prop('func_cdgladdship_nofleettip2');
                var func_cdgladdship_nofleettip3=$.i18n.prop('func_cdgladdship_nofleettip3');
                var html = [];
                html.push('<TABLE border=0 style="width:390px;height:70px;">');
                html.push('	<TR>');
                html.push('		<TD style="width:64px;height:58px;text-align:left;vertical-align:middle;"></TD>');
                html.push('		<TD style="width:58px;height:58px;text-align:left;vertical-align:middle;">');
                html.push('			<div class="cdgladdship_addfleet_a">');
                html.push('		</TD>');
                html.push('		<TD style="width:25px;height:58px;text-align:left;vertical-align:middle;"></TD>');
                html.push('		<TD style="width:234px;height:30px;text-align:left;vertical-align:middle;">');
                html.push('			'+func_cdgladdship_nofleettip1+'</br>'+func_cdgladdship_nofleettip2+'&nbsp<a href="javascript:void(0);" id="dialogNoFleetShowFleetManagerA">'+func_cdgladdship_nofleettip3+'</a>');
                html.push('		</TD>');
                html.push('		<TD style="width:9px;height:58px;text-align:left;vertical-align:middle;"></TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            _dialogNoFleetAClick:function () {
                if(this._popPanelNotShipFleetMsg) this._popPanelNotShipFleetMsg.remove();
                this._popPanelNotShipFleetMsg=null;

                this.menu.mainmenu.menuHandler("ict_menu_main_cdgl",true);
            },
            _showMsg:function (msginfo) {
                // alert(msginfo);
                L.ict.app.util.dialog.warn($.i18n.prop('dialog_alert_title'),msginfo);

            },
            _showErrorMsg:function (errormsg) {
                // alert(errormsg);
                L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),errormsg);                                                
            }

    });

});
