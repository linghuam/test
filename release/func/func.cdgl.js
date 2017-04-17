/**
 * Created by Administrator on 2017/03/03.
 */
define("func/cdgl",[
    "leaflet",
    "func/base",
    "control/panel",
    "plugins/mcscroll",
    // "plugins/my97DatePicker",
    "plugins/ztree",
    "data/ajax",
    "layout/menu"

],function(L){

    L.ICT.Func.add("cdgl",{

        id:'cdgl',

        Class: L.Class.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.util = L.ict.app.util;
                this.dateUtil = L.ict.app.util.dateTime;
                this.ajax = new L.ICT.Ajax();
                this.config = Project_ParamConfig.cdglConfig;
                if (L.ict.app.sessionStorage.getItem("userInfo")!=null){
                    var user=L.ict.app.sessionStorage.getItem("userInfo");
                    this.loginUserId=user.userId;
                }else{
                    this.loginUserId="";
                }
                this.menuid = 'ict_menu_main_cdgl';
                this._popPanel = null;

                this._delType="";//删除类型，分别为 fleet  ship
                this._editDelId="";//船队编辑和船队船舶删除时使用的id值
                this._AddEditType="";//增加或修改的类型，分别为 add edit
                this._editShipObj={};//编辑船舶时选中的船舶对象

                this._popPanelShipFleetAddEdit = null;//船队修改删除对话框时的popPanel
                this._popPanelShipAddEdit = null;//船舶新增修改对话框的popPanel
                this._popPanelDel = null;//船队船舶删除话框的popPanel

                this.zTreeData=[];
                this.zTree1=null;

                this.zTreeClickNodeID="";
                this.zTreeClickNodeType="";

                this._pageInfoInit();
            },
            start:function(){
                this.menu.mainmenu.deactiveMenuExceptOne(this.menuid);
                //登录提示
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();     
                    this.menu.mainmenu.deactiveMenu(this.menuid);                
                    return;
                 }  
                if(this._popPanel) return;
                this._initUI();
                this._initEvts();

                this._initTree();
            },

            stop:function(){
                if(this._popPanel) this._popPanel.remove();
            },
            _initUI:function(){
                var lanset=window.localStorage.getItem("language"); //如果是中文，返回值为'zh';如果是英文，返回值为'en'
                var titlename=$.i18n.prop('func_cdgl_titlename');
                var options = {
                    title:titlename,
                    width:990,
                    height:515,
                    top:100,
                    left:200,
                    contentHTML:this._getContentHTML()
                };
                var pop = this._popPanel = new L.ICT.PopPanel(options);
                pop.show();

                $('#cdgl_input_sj_end').val(this.formatDateH(new Date()));
                var startsj=this.getNewDateTimeBeforHour(24);
                $('#cdgl_input_sj_start').val(this.formatDateH(startsj));
            },
            formatDateH:function (newDate) {
                var year=newDate.getFullYear();
                var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
                var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
                var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
                var ret=year+"-"+month+"-"+day+" "+hours;
                return ret;
            },
            getNewDateTimeBeforHour:function(beforeH){
                var newDate=new Date();
                newDate = newDate.valueOf();
                newDate=newDate- beforeH*60 * 60 * 1000;
                newDate = new Date(newDate)
                return newDate;
            },
            _initEvts:function(){
                    self = this;

                //窗口关闭事件
                this._popPanel.on("popPanelRemove",function(){
                    this._popPanel = null;
                    this.menu.mainmenu.deactiveMenu(this.menuid);
                },this);
            },
            _getContentHTML:function(){
                var func_cdgl_lb_cdlb=$.i18n.prop('func_cdgl_lb_cdlb');
                var func_cdgl_lb_sjll=$.i18n.prop('func_cdgl_lb_sjll');
                var func_cdgl_where_lb_qzss=$.i18n.prop('func_cdgl_where_lb_qzss');
                var func_cdgl_where_lb_z=$.i18n.prop('func_cdgl_where_lb_z');

                var func_cdgl_lb_add=$.i18n.prop('func_cdgl_lb_add');
                var common_btn_ok=$.i18n.prop('common_btn_ok');

                var html = [];
                html.push('<TABLE border=0 style="width:970px;height:445px;">');
                html.push('	<TR>');
                html.push('		<TD width=260px height="100%";align=center valign=top>');
                html.push('			<TABLE border=0 style="width:100%;height:100%;">');
                html.push('				<TR style="width:100%;height:25px;">');
                html.push('					<TD style="width:80px;height:25px;" align=left valign=top>');
                html.push('						<label id="cdgl_lb_cdlb" class="cdgl_labelfont">'+func_cdgl_lb_cdlb+'</label>');
                html.push('					</TD>');
                html.push('					<TD style="width:100px;height:25px;" align=right valign=top>');
                html.push('						<div id="cdgl_btn_add" class="cdgl_img_btn_add" onclick="self._shipFleet_Add();">'+func_cdgl_lb_add+'</div>');
                html.push('					</TD>');
                html.push('				</TR>');
                html.push('				<TR style="width:100%;height:5px;">');
                html.push('				</TR>');
                html.push('				<TR style="width:100%;height:420px;">');
                html.push('					<TD style="width:100%;height:420px;border:1px solid #b5b5b5;" align=left valign=top colspan="2">');
                html.push('						<div style="width:100%;height:100%;">');
                html.push('							<ul id="treeDiv" class="tree"></ul>');
                html.push('						</div>');
                html.push('					</TD>');
                html.push('				</TR>');
                html.push('			</TABLE>');
                html.push('		</TD>');
                html.push('		<TD width=10px width="100%" height="100%";align=center valign=top>');
                html.push('		</TD>');
                html.push('		<TD width=700px height="100%";align=center valign=top>');
                html.push('			<TABLE border=0 style="width:100%;height:100%;">');
                html.push('				<TR style="width:100%;height:25px;">');
                html.push('					<TD style="width:100%;height:25px;" align=left valign=top>');
                html.push('						<label id="cdgl_lb_sjll" class="cdgl_labelfont">'+func_cdgl_lb_sjll+'</label>');
                html.push('					</TD>');
                html.push('				</TR>');
                html.push('				<TR style="width:100%;height:5px;">');
                html.push('				</TR>');
                html.push('				<TR style="width:100%;height:425px;">');
                html.push('					<TD style="width:100%;height:420px;border:1px solid #b5b5b5;padding-left:20px;">');
                html.push('						<table style="width:100%;height:100%;">');
                html.push('							<tr style="width100%;height:50px;padding-top:20px;">');
                html.push('								<td style="width:70px;"><label id="cdgl_where_lb_qzss" class="cdgl_labelfont">'+func_cdgl_where_lb_qzss+'</label></td>');
                html.push('								<td style="width:130px;"><input class="Wdate up_po_custom_in" type="text" id="cdgl_input_sj_start" style="height:25px;line-height:25px;width:126px;border:1px solid #b5b5b5;" onFocus="WdatePicker({readOnly:true,dateFmt:\'yyyy-MM-dd HH\',isShowClear:false,startDate:\'%y-%M-01 00:00:00\',alwaysUseStartDate:true,maxDate:\'%y-%M-%d %H:%m:%s\'})"/></td>');
                html.push('								<td style="width:30px;"><label id="cdgl_where_lb_z" class="cdgl_labelfont">'+func_cdgl_where_lb_z+'</label></td>');
                html.push('								<td style="width:130px;"><input class="Wdate up_po_custom_in" type="text" id="cdgl_input_sj_end" style="height:25px;line-height:25px;width:126px;border:1px solid #b5b5b5;" onFocus="WdatePicker({readOnly:true,dateFmt:\'yyyy-MM-dd HH\',isShowClear:false,startDate:\'%y-%M-01 00:00:00\',alwaysUseStartDate:true,maxDate:\'%y-%M-%d %H:%m:%s\'})"/></td>');
                html.push('								<td style="width:60px;"><div id="cdgl_btn_search" class="cdgl_img_btn_ok" onclick="self._eventSearch(true);">'+common_btn_ok+'</div></td>');
                html.push('								<td style="width:300px;"></td>');
                html.push('							</tr>');
                html.push('							<tr style="width:100%;height:5px;"><td colspan="6"></td></tr>');
                html.push('							<tr style="width:100%;height:350px;">');
                html.push('								<td colspan="6">');
                html.push('									<div id="cdgl_dialog_event_list" style="width:100%;height:340px;padding-left:10px;padding-right:10px;"></div>');
                html.push('									<div id="cdgl_div_page" style="width:100%;height:30px;text-align:right;padding-right:20px;"></div>');
                html.push('								</td>');
                html.push('							</tr>');
                html.push('						</table>');
                html.push('					</TD>');
                html.push('				</TR>');
                html.push('			</TABLE>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            
            _initTree:function () {
                this.zTreeClickNodeID="";
                this.zTreeClickNodeType="";

                var url = self.config.getTreeUrl;
                var data = {};
                var nowsj = new Date();
                data.timespane=nowsj.getTime().toString();
                data.user_id=this.loginUserId;
                self.ajax.post(url,data,true,this,function(res){
                    this._initTreeSucess(res);
                },function(res){
                    this._initTreeError(res);
                });
            },

            _initTreeSucess:function (res) {
                if(res.state!=1){
                    var func_cdgl_error_msg_getFleetInfo=$.i18n.prop('func_cdgl_error_msg_getFleetInfo');
                    this._showErrorMsg(func_cdgl_error_msg_getFleetInfo);
                }else{
                    var treeData = [];
                    var aryinfo=res.msg;
                    for (var i=0;i<aryinfo.length;i++){
                        var onefleet={};
                        onefleet.id=aryinfo[i].id;
                        if (aryinfo[i].name_cn!=null && aryinfo[i].name_cn!=""){
                            onefleet.name=aryinfo[i].name_cn;
                        }else{
                            onefleet.name=aryinfo[i].name_en;
                        }
                        onefleet.remark=aryinfo[i].remark;
                        onefleet.open=true;
                        onefleet.type="1";

                        var nodes=aryinfo[i].shiplist;
                        for (var k=0;k<nodes.length;k++){
                            nodes[k].id=nodes[k].id;
                            nodes[k].shipfleetid=nodes[k].shipfleetid;
                            nodes[k].shipid=nodes[k].shipid;
                            nodes[k].name=nodes[k].shipname;
                            nodes[k].mmsi=nodes[k].mmsi;
                            nodes[k].type="2";
                        }
                        onefleet.nodes=nodes;
                        
                        treeData.push(onefleet);
                    }
                    this.zTreeData=treeData;
                    this.zTree1 = $("#treeDiv").zTree(this._getZtreeSetting(), this._clone(treeData, ""));
                }
            },
            _getZtreeSetting:function () {
                var setting= {
                    addDiyDom: this._addDiyDom
                };
                return setting;
            },
            _addDiyDom:function (treeId, treeNode) {
                $("#" + treeNode.tId + "_span").css("background-color","#ffffff");
                $("#" + treeNode.tId + "_span").css("display",":-moz-inline-box");
                $("#" + treeNode.tId + "_span").css("display","inline-block");
                var aObj = $("#" + treeNode.tId + "_a");

                var infonode=treeNode.id+"|"+treeNode.type;
                if (treeNode.type=="2"){
                    infonode=treeNode.mmsi+"|"+treeNode.type;
                }
                //aObj.bind("click", function(){self._zTreeNodeClick(infonode);});
                var nodespaneobj=$("#" + treeNode.tId + "_span");
                nodespaneobj.bind("click", function(){self._zTreeNodeClick(infonode);});
                if (treeNode.type=="1"){
                    $("#" + treeNode.tId + "_span").css("width","153px");
                    var editStr="";
                    editStr = editStr+ "<button type='button' class='cdgl_tree_edit' id='img_shipfleet_edit" +treeNode.id+ "'></button>";
                    editStr = editStr+ "<button type='button' class='cdgl_tree_del' id='img_shipfleet_del" +treeNode.id+ "'></button>";
                    aObj.append(editStr);

                    var btn1 = $("#img_shipfleet_del"+treeNode.id);
                    if (btn1) btn1.bind("click", function(){self._shipFleet_Del(treeNode.id);});

                    var btn2 = $("#img_shipfleet_edit"+treeNode.id);
                    if (btn2) btn2.bind("click", function(){self._shipFleet_Edit(treeNode.id);});
                }else if (treeNode.type=="2"){
                    $("#" + treeNode.tId + "_span").css("width","135px");
                    var editStr="";
                    editStr = editStr+ "<button type='button' class='cdgl_tree_edit' id='img_ship_edit" +treeNode.id+ "'></button>";
                    editStr = editStr+ "<button type='button' class='cdgl_tree_del' id='img_ship_del" +treeNode.id+ "'></button>";
                    aObj.append(editStr);

                    var btn1 = $("#img_ship_del"+treeNode.id);
                    if (btn1) btn1.bind("click", function(){self._ship_Del(treeNode.id);});

                    var btn2 = $("#img_ship_edit"+treeNode.id);
                    var info=treeNode.id+"|"+treeNode.shipfleetid+"|"+treeNode.shipid+"|"+treeNode.name+"|"+treeNode.mmsi;
                    if (btn2) btn2.bind("click", function(){self._ship_Edit(info);});
                }
            },
            _clone:function (jsonObj, newName) {
                var buf;
                if (jsonObj instanceof Array) {
                    buf = [];
                    var i = jsonObj.length;
                    while (i--) {
                        buf[i] = this._clone(jsonObj[i], newName);
                    }
                    return buf;
                }else if (typeof jsonObj == "function"){
                    return jsonObj;
                }else if (jsonObj instanceof Object){
                    buf = {};
                    for (var k in jsonObj) {
                        buf[k] = this._clone(jsonObj[k], newName);
                        if (k=="name") buf[k] += newName;
                    }
                    return buf;
                }else{
                    return jsonObj;
                }
            },
            _initTreeError:function (res) {
                var func_cdgl_error_msg_getFleetInfo=$.i18n.prop('func_cdgl_error_msg_getFleetInfo');
                this._showErrorMsg(func_cdgl_error_msg_getFleetInfo);
            },
            _shipFleet_Edit:function(id){
                if(this._popPanelShipFleetAddEdit) return;
                var func_cdgl_editfleet_titlename=$.i18n.prop('func_cdgl_editfleet_titlename');
                self._dialogShipFleetAddEditOpen(func_cdgl_editfleet_titlename);
                this._AddEditType="edit";
                this._editDelId=id;
                for (var i=0;i<this.zTreeData.length;i++){
                    if (this.zTreeData[i].id==id){
                        $("#dialogShipFleetAddEditName").val(this.zTreeData[i].name);
                        $("#dialogShipFleetAddEditRemark").val(this.zTreeData[i].remark);
                        break;
                    }
                }
            },
            _shipFleet_Add:function(){
                if(this._popPanelShipFleetAddEdit) return;
                var func_cdgl_addfleet_titlename=$.i18n.prop('func_cdgl_addfleet_titlename');
                self._dialogShipFleetAddEditOpen(func_cdgl_addfleet_titlename);
                this._AddEditType="add";
                $("#dialogShipFleetAddEditName").val("");
            },
            
            _dialogShipFleetAddEditOpen:function (titleinfo) {
                var options = {
                    title:titleinfo,
                    width:410,
                    height:250,
                    top:200,
                    left:450,
                    contentHTML:this._getContentHtmlDialogShipFleetAddEdit()
                };
                var pop = this._popPanelShipFleetAddEdit = new L.ICT.PopPanel(options);
                pop.show();

                $('#cdgl_addeditfleet_inputfleenametip').val("");

                this._popPanelShipFleetAddEdit.on("popPanelRemove",function(){
                    this._popPanelShipFleetAddEdit = null;
                },this);
            },
            _getContentHtmlDialogShipFleetAddEdit:function () {
                var func_cdgl_addeditfleet_name=$.i18n.prop('func_cdgl_addeditfleet_name');
                var func_cdgl_addeditfleet_remarks=$.i18n.prop('func_cdgl_addeditfleet_remarks');
                var common_btn_ok=$.i18n.prop('common_btn_ok');
                var common_btn_cancel=$.i18n.prop('common_btn_cancel');

                var html = [];
                html.push('<TABLE border=0 style="width:390px;height:180px;">');
                html.push('	<TR>');
                html.push('		<TD style="width:95px;height:30px;text-align:left;vertical-align:middle;padding-left:30px;">');
                html.push('			<label class="cdgl_labelfont">'+func_cdgl_addeditfleet_name+'</label>');
                html.push('		</TD>');
                html.push('		<TD style="width:295px;height:30px;text-align:left;vertical-align:middle;">');
                html.push('			<input type="text" id="dialogShipFleetAddEditName" class="cdgl_labelfont" style="width:270px"/>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD style="width:390px;height:20px;line-height:20px;text-align:left;vertical-align:middle;padding-left:30px;" colspan="2">');
                html.push('			<input type="text" id="cdgl_addeditfleet_inputfleenametip" class="cdgl_font_error" readonly="true" style="width:100%;"/>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD style="width:95px;height:30px;text-align:left;vertical-align:middle;padding-left:30px;">');
                html.push('			<label class="cdgl_labelfont">'+func_cdgl_addeditfleet_remarks+'</label>');
                html.push('		</TD>');
                html.push('		<TD style="width:295px;height:30px;text-align:left;vertical-align:middle;">');
                html.push('			<textarea id="dialogShipFleetAddEditRemark" style="width:270px;height:80px;"></textarea>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD width=390px height="58px";align=center valign=center padding-left:60px; colspan="2">');
                html.push('		    <table style="height:100%;width:100%">');
                html.push('						<tr style="height:100%;width:100%">');
                html.push('									<td style="height:100%;width:100%;padding-left:135px;">');
                html.push('										<div id="dialogShipFleetAddEditBtnOk" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogShipFleetAddEditBtnClickOk();">'+common_btn_ok+'</div>');
                html.push('									</td>');
                //html.push('									<td style="height:100%;width:50%;padding-left:20px;">');
                //html.push('										<div id="dialogShipFleetAddEditBtnCancel" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogShipFleetAddEditBtnClickCancel();">'+common_btn_cancel+'</div>');
                //html.push('									</td>');
                html.push('						</tr>');
                html.push('			</table>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            _dialogShipFleetAddEditBtnClickCancel:function () {
                if(this._popPanelShipFleetAddEdit) this._popPanelShipFleetAddEdit.remove();
                this._popPanelShipFleetAddEdit=null;
            },
            _dialogShipFleetAddEditBtnClickOk:function () {
                $("#cdgl_addeditfleet_inputfleenametip").val("");
                var inputname=$("#dialogShipFleetAddEditName").val();
                if (inputname==""){
                    var func_cdgl_addeditfleet_inputfleenametip=$.i18n.prop('func_cdgl_addeditfleet_inputfleenametip');
                    $('#cdgl_addeditfleet_inputfleenametip').val(func_cdgl_addeditfleet_inputfleenametip);
                    return;
                }
                var url = self.config.saveShipFleetUrl;
                var data = {};
                var nowsj = new Date();
                data.timespane=nowsj.getTime().toString();
                data.addEditType=this._AddEditType;
                if (this._AddEditType=="add"){
                    data.id="";
                }else{
                    data.id=this._editDelId;
                }
                data.name_en=inputname;
                data.name_cn=inputname;
                data.remark=$("#dialogShipFleetAddEditRemark").val();
                data.user_id=this.loginUserId;
                self.ajax.post(url,data,true,this,function(res){
                    if(res.state!=1){
                        var func_cdgl_msg_tip_save_failed=$.i18n.prop('func_cdgl_msg_tip_save_failed');
                        $('#cdgl_addeditfleet_inputfleenametip').val(func_cdgl_msg_tip_save_failed);
                    }else{
                        //var func_cdgl_msg_tip_save_sucess=$.i18n.prop('func_cdgl_msg_tip_save_sucess');
                        //this._showMsg(func_cdgl_msg_tip_save_sucess);
                        this._dialogShipFleetAddEditBtnClickCancel();
                        this._initTree();
                    }
                },function(res){
                    var func_cdgl_msg_tip_save_failed=$.i18n.prop('func_cdgl_msg_tip_save_failed');
                    $('#cdgl_addeditfleet_inputfleenametip').val(func_cdgl_msg_tip_save_failed);
                });
            },
            _shipFleet_Del:function(id){
                if(this._popPanelDel) return;
                this._editDelId=id;
                this._delType="fleet";
                var func_cdgl_delfleet_titlename=$.i18n.prop('func_cdgl_delfleet_titlename');
                self._dialogShipFleetDelOpen(func_cdgl_delfleet_titlename,"1");
            },
            _dialogShipFleetDelOpen:function (titleinfo,isFleet) {
                var options = {
                    title:titleinfo,
                    width:410,
                    height:220,
                    top:200,
                    left:450,
                    contentHTML:this._getContentHtmlDialogDel(isFleet)
                };
                var pop = this._popPanelDel = new L.ICT.PopPanel(options);
                pop.show();

                this._popPanelDel.on("popPanelRemove",function(){
                    this._popPanelDel = null;
                },this);
            },
            _getContentHtmlDialogDel:function (isFleet) {
                var func_cdgl_msg_tip_del="";
                if (isFleet=="1"){
                    func_cdgl_msg_tip_del=$.i18n.prop('func_cdgl_msg_tip_del_fleet');
                }else{
                    func_cdgl_msg_tip_del=$.i18n.prop('func_cdgl_msg_tip_del_ship');
                }
                var common_btn_ok=$.i18n.prop('common_btn_ok');
                var common_btn_cancel=$.i18n.prop('common_btn_cancel');
                var html = [];
                html.push('<TABLE border=0 style="width:390px;height:160px;">');
                html.push('	<TR>');
                html.push('		<TD width=390px height="80px" style="padding-left:78px;padding-top:10px;">');
                html.push('			<img src="./themes/images/baoChuan/error.png" style="width:40px;height:40px;"><label class="cdgl_labelfont_del">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+func_cdgl_msg_tip_del+'</label>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD width=390px height="58px";align=center valign=center padding-left:60px;>');
                html.push('		    <table style="height:100%;width:100%">');
                html.push('						<tr style="height:100%;width:100%">');
                html.push('									<td style="height:100%;width:50%;padding-left:67px;">');
                html.push('										<div id="dialogDelBtnOk" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogDelBtnClickOk();">'+common_btn_ok+'</div>');
                html.push('									</td>');
                html.push('									<td style="height:100%;width:50%;padding-left:20px;">');
                html.push('										<div id="dialogDelBtnCancel" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogDelBtnClickCancel();">'+common_btn_cancel+'</div>');
                html.push('									</td>');
                html.push('						</tr>');
                html.push('			</table>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            _dialogDelBtnClickCancel:function () {
                if(this._popPanelDel) this._popPanelDel.remove();
                this._popPanelDel=null;
            },
            _dialogDelBtnClickOk:function () {
                var func_cdgl_msg_tip_del_failed=$.i18n.prop('func_cdgl_msg_tip_del_failed');
                var func_cdgl_msg_tip_del_sucess=$.i18n.prop('func_cdgl_msg_tip_del_sucess');

                if (this._delType=="fleet"){
                    var url = self.config.delShipFleetUrl;
                    var data = {};
                    var nowsj = new Date();
                    data.timespane=nowsj.getTime().toString();
                    data.id=this._editDelId;
                    self.ajax.post(url,data,true,this,function(res){
                        if(res.state!=1){
                            this._showErrorMsg(func_cdgl_msg_tip_del_failed);
                        }else{
                            //this._showMsg(func_cdgl_msg_tip_del_sucess);
                            this._dialogDelBtnClickCancel();
                            this._initTree();
                        }
                    },function(res){
                        this._showErrorMsg(func_cdgl_msg_tip_del_failed);
                    });
                }else{
                    var url = self.config.delShipUrl;
                    var data = {};
                    var nowsj = new Date();
                    data.timespane=nowsj.getTime().toString();
                    data.id=this._editDelId;
                    self.ajax.post(url,data,true,this,function(res){
                        if(res.state!=1){
                            this._showErrorMsg(func_cdgl_msg_tip_del_failed);
                        }else{
                            //this._showMsg(func_cdgl_msg_tip_del_sucess);
                            this._dialogDelBtnClickCancel();
                            this._initTree();
                        }
                    },function(res){
                        this._showErrorMsg(func_cdgl_msg_tip_del_failed);
                    });
                }
            },
            _ship_Del:function(id){
                if(this._popPanelDel) return;
                this._editDelId=id;
                this._delType="ship";
                var func_cdgl_delship_titlename=$.i18n.prop('func_cdgl_delship_titlename');
                self._dialogShipFleetDelOpen(func_cdgl_delship_titlename,"0");
            },
            _ship_Edit:function(info){
                if(this._popPanelShipAddEdit) return;
                this._editShipObj={};
                var aryinfo=info.split("|");
                this._editShipObj.id=aryinfo[0];
                this._editShipObj.shipfleetid=aryinfo[1];
                this._editShipObj.shipid=aryinfo[2];
                this._editShipObj.shipname=aryinfo[3];
                this._editShipObj.mmsi=aryinfo[4];
                self._dialogShipAddEditOpen();
            },
            _dialogShipAddEditOpen:function () {
                var func_cdgl_editship_titlename=$.i18n.prop('func_cdgl_editship_titlename');
                var options = {
                    title:func_cdgl_editship_titlename,
                    width:410,
                    height:150,
                    top:200,
                    left:450,
                    contentHTML:this._getContentHtmlDialogShipAddEdit()
                };
                var pop = this._popPanelShipAddEdit = new L.ICT.PopPanel(options);
                pop.show();

                $("#dialogShipAddEditFleet").empty();
                for (var i=0;i<this.zTreeData.length;i++){
                    $("#dialogShipAddEditFleet").append("<option value='"+this.zTreeData[i].id+"'>"+this.zTreeData[i].name+"</option>");
                }

                this._popPanelShipAddEdit.on("popPanelRemove",function(){
                    this._popPanelShipAddEdit = null;
                },this);
            },
            _getContentHtmlDialogShipAddEdit:function () {
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
                html.push('			<select id="dialogShipAddEditFleet" class="cdgl_labelfont" style="width:275px"></select>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD width=390px height="58px";align=center valign=center padding-left:60px; colspan="2">');
                html.push('		    <table style="height:100%;width:100%">');
                html.push('						<tr style="height:100%;width:100%">');
                html.push('									<td style="height:100%;width:100%;padding-left:135px;">');
                html.push('										<div id="dialogShipAddEditBtnOk" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogShipAddEditBtnClickOk();">'+common_btn_ok+'</div>');
                html.push('									</td>');
                //html.push('									<td style="height:100%;width:50%;padding-left:20px;">');
                //html.push('										<div id="dialogShipAddEditBtnCancel" class="cdgl_dialog_btn_ok_cancel" onclick="self._dialogShipAddEditBtnClickCancel();">'+common_btn_cancel+'</div>');
                //html.push('									</td>');
                html.push('						</tr>');
                html.push('			</table>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
            _dialogShipAddEditBtnClickCancel:function () {
                if(this._popPanelShipAddEdit) this._popPanelShipAddEdit.remove();
                this._popPanelShipAddEdit=null;
            },
            _dialogShipAddEditBtnClickOk:function () {
                var func_cdgl_editship_tip_selectfleet=$.i18n.prop('func_cdgl_editship_tip_selectfleet');
                var func_cdgl_msg_tip_edit_sucess=$.i18n.prop('func_cdgl_msg_tip_edit_sucess');
                var func_cdgl_msg_tip_edit_failed=$.i18n.prop('func_cdgl_msg_tip_edit_failed');

                var selectid=$('#dialogShipAddEditFleet option:selected').val();
                if (selectid==""){
                    this._showErrorMsg(func_cdgl_editship_tip_selectfleet)
                    return;
                }
                var data = {};
                var nowsj = new Date();
                data.timespane=nowsj.getTime().toString();
                data.id=this._editShipObj.id;
                data.shipfleetid=selectid;
                var url = self.config.saveShipUrl;
                self.ajax.post(url,data,true,this,function(res){
                    if(res.state!=1){
                        this._showErrorMsg(func_cdgl_msg_tip_edit_failed);
                    }else{
                        //this._showMsg(func_cdgl_msg_tip_edit_sucess);
                        this._initTree();
                    }
                },function(res){
                    this._showErrorMsg(func_cdgl_msg_tip_edit_failed);
                });

                if(this._popPanelShipAddEdit) this._popPanelShipAddEdit.remove();
                this._popPanelShipAddEdit=null;
            },
            _getzTreeNodeShipIdList:function () {
                var shipidstr="";
                if (this.zTreeClickNodeType==null){
                    return shipidstr;
                }
                if (this.zTreeClickNodeType==""){
                    return shipidstr;
                }

                if (this.zTreeClickNodeType=="1"){
                    var nodeone=null;
                    for (var k=0;k<this.zTreeData.length;k++){
                        if (this.zTreeData[k].id==this.zTreeClickNodeID){
                            nodeone=this.zTreeData[k];
                            break;
                        }
                    }
                    if (nodeone!=null){
                        nodeslist=nodeone.nodes;
                        for (var m=0;m<nodeslist.length;m++){
                            if (shipidstr!=""){
                                shipidstr=shipidstr+","+nodeslist[m].mmsi;
                            }else{
                                shipidstr=nodeslist[m].mmsi;
                            }
                        }
                    }
                }else{
                    shipidstr=this.zTreeClickNodeID;
                }
                return shipidstr;
            },
            _zTreeNodeClick:function (nodeclickinfo) {
                var aryinfo=nodeclickinfo.split("|");
                this.zTreeClickNodeID=aryinfo[0];
                this.zTreeClickNodeType=aryinfo[1];

                this._eventSearch(true);
            },
            _eventGetSearchWhere:function () {
                var shipidstr=this._getzTreeNodeShipIdList();
                var sjstart=$("#cdgl_input_sj_start").val()+":00:00";
                var sjend=$("#cdgl_input_sj_end").val()+":59:59";
                var data={};
                var nowsj = new Date();
                data.timespane=nowsj.getTime().toString();
                data.shipidstr=shipidstr;
                data.ischeckshipid="1";
                data.startsj=sjstart;
                data.endsj=sjend;
                data.pagesize=this.pagesize;
                data.pagenum=this.pagenum;
                return data;
            },
            _eventSearch:function (isInitPaggInfo) {
                if (isInitPaggInfo){
                    this._pageInfoInit();
                }
                var func_cdgl_error_msg_getEventInfo=$.i18n.prop('func_cdgl_error_msg_getEventInfo');
                var data=this._eventGetSearchWhere();
                var url = self.config.getEventListUrl;
                self.ajax.post(url,data,true,this,function(res){
                    if(res.state!=1){
                        this._showErrorMsg(func_cdgl_error_msg_getEventInfo);
                    }else{
                        this._showEventListSucess(res);
                    }
                },function(res){
                    this._showErrorMsg(func_cdgl_error_msg_getEventInfo);
                });
            },
            _showEventListSucess:function (data) {
                this._showDivEventList(data);

                this.reccount=data.reccount;
                this.pagecount=data.pagecount;
                this.pagesize=data.pagesize;
                this.pagenum=data.pagenum;
                var isresShowDivPage=true;
                for (var i=0;i<this.curShowPageLabelAry.length;i++)
                {
                    if (this.curShowPageLabelAry[i]==this.pagenum)
                    {
                        isresShowDivPage=false;
                    }
                }

                var reclist=data.rec;
                if (reclist!=null && reclist.length>0){
                    if (isresShowDivPage)
                    {
                        this._showDivPageInfo();
                    }
                    this._DivPageNumLabelSetCur();
                }
            },
            _showDivEventList:function (data) {
                var func_cdgl_datagrid_xh=$.i18n.prop('func_cdgl_datagrid_xh');
                var func_cdgl_datagrid_shipName=$.i18n.prop('func_cdgl_datagrid_shipName');
                var func_cdgl_datagrid_time=$.i18n.prop('func_cdgl_datagrid_time');
                var func_cdgl_datagrid_state=$.i18n.prop('func_cdgl_datagrid_state');
                var func_cdgl_datagrid_portName=$.i18n.prop('func_cdgl_datagrid_portName');

                var reclist=data.rec;
                var rowbackcolor="#e6effe";
                var htmlstr='<table style="width:100%;font-family:Microsoft Yahei;font-size:12px;" border="0" cellspacing="0">';

                if (reclist!=null && reclist.length>0) {
                    htmlstr = htmlstr + '<tr style="background-color:' + rowbackcolor + ';width:100%;height:30px;line-height:30px;text-align:left;">';
                    htmlstr = htmlstr + '<td style="width:50px;height:100%;text-align:center;vertical-align:middle;">';
                    htmlstr = htmlstr + func_cdgl_datagrid_xh;
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '<td style="width:150px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr = htmlstr + func_cdgl_datagrid_shipName;
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr = htmlstr + 'MMSI';
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '<td style="width:160px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr = htmlstr + func_cdgl_datagrid_time;
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr = htmlstr + func_cdgl_datagrid_state;
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '<td style="width:180px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr = htmlstr + func_cdgl_datagrid_portName;
                    htmlstr = htmlstr + '</td>';
                    htmlstr = htmlstr + '</tr>';
                    for (var k = 0; k < reclist.length; k++) {
                        if (rowbackcolor == "#e6effe") {
                            rowbackcolor = "#ffffff";
                        } else {
                            rowbackcolor = "#e6effe";
                        }
                        htmlstr = htmlstr + '<tr style="background-color:' + rowbackcolor + ';width:100%;height:30px;line-height:30px;text-align:left;">';
                        htmlstr = htmlstr + '<td style="width:50px;height:100%;text-align:center;vertical-align:middle;">';
                        htmlstr = htmlstr + (k + 1).toString();
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '<td style="width:150px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr = htmlstr + reclist[k].ship_name;
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr = htmlstr + reclist[k].mmsi;
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '<td style="width:160px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr = htmlstr + reclist[k].sj_str;
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                        var lanset = window.localStorage.getItem("language");
                        var state1 = reclist[k].state_name;
                        var stateconvert = "";
                        if (state1 == "进港") {
                            stateconvert = $.i18n.prop('func_cdgl_datagrid_state_jg');
                        } else if (state1 == "出港") {
                            stateconvert = $.i18n.prop('func_cdgl_datagrid_state_cg');
                        }
                        htmlstr = htmlstr + stateconvert;
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '<td style="width:180px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr = htmlstr + reclist[k].port_name;
                        htmlstr = htmlstr + '</td>';
                        htmlstr = htmlstr + '</tr>';
                    }
                }else{
                    var func_cdgl_msg_tip_event_noseachresult=$.i18n.prop('func_cdgl_msg_tip_event_noseachresult');
                    htmlstr=htmlstr+'<tr style="width:100%;height:330px;line-height:330px;text-align:center;">';
                    htmlstr=htmlstr+'<td style="width:100%;height:100%;line-height:330px;text-align:center;vertical-align:middle;">';
                    htmlstr=htmlstr+'<label>'+func_cdgl_msg_tip_event_noseachresult+'</label>';
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'</tr>';
                }
                htmlstr=htmlstr+'</table>';
                $('#cdgl_dialog_event_list').html(htmlstr);
            },
            _pageInfoInit:function () {
                this.showpagelabelcount=5;
                this.curShowPageLabelAry=[];
                this.pagesize=10;
                this.pagenum=1;
                this.reccount=0;
                this.pagecount=0;
            },
            _showDivPageInfo:function () {
                this.curShowPageLabelAry=[];
                var pagenum1=this.pagecount-this.pagenum;
                var bjnum=parseInt(this.showpagelabelcount.toString()) - parseInt("1");
                if (pagenum1>=bjnum)
                {
                    this.curShowPageLabelAry.push(this.pagenum);
                    for (var i=1;i<this.showpagelabelcount;i++)
                    {
                        var newpagenum=parseInt(this.pagenum.toString()) + parseInt(i.toString());
                        if (newpagenum<=this.pagecount)
                        {
                            this.curShowPageLabelAry.push(newpagenum);
                        }
                    }
                }else{
                    var endpage=parseInt(this.pagecount.toString());
                    var startpage=parseInt(this.pagecount.toString()) - parseInt(this.showpagelabelcount.toString()) + parseInt("1");
                    if (startpage<=0)
                    {
                        startpage=1;
                    }
                    for (var n=startpage;n<=endpage;n++)
                    {
                        this.curShowPageLabelAry.push(n);
                    }
                }

                var func_cdgl_page_first=$.i18n.prop('func_cdgl_page_first');
                var func_cdgl_page_last=$.i18n.prop('func_cdgl_page_last');
                var func_cdgl_page_previous=$.i18n.prop('func_cdgl_page_previous');
                var func_cdgl_page_next=$.i18n.prop('func_cdgl_page_next');
                var htmlstr='<label id="divPageFirst" class="cdgl_page_first"  onclick="self._divPageClickFirst();">'+func_cdgl_page_first+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>';
                for (var k=0;k<this.curShowPageLabelAry.length;k++)
                {
                    htmlstr=htmlstr+'<label class="cdgl_page_numlabel_noselect" id="divPageNumLabel_'+this.curShowPageLabelAry[k]+'" onclick="self._divPageClickNum('+this.curShowPageLabelAry[k]+');">'+this.curShowPageLabelAry[k]+'</label>';
                }
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="cdgl_page_last"  onclick="self._divPageClickLast();">'+func_cdgl_page_last+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="cdgl_page_pre"  onclick="self._divPageClickPre();">'+func_cdgl_page_previous+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="cdgl_page_next" onclick="self._divPageClickNext();">'+func_cdgl_page_next+'</label>';

                $('#cdgl_div_page').html(htmlstr);
            },
            //设置当前页label的样式
            _DivPageNumLabelSetCur:function () {
                for (var i=0;i<this.curShowPageLabelAry.length;i++){
                    if (this.curShowPageLabelAry[i]==this.pagenum){
                        $("#divPageNumLabel_"+this.curShowPageLabelAry[i]).attr("class", "cdgl_page_numlabel_select");
                    }else{
                        $("#divPageNumLabel_"+this.curShowPageLabelAry[i]).attr("class", "cdgl_page_numlabel_noselect");
                    }
                }
            },
            _divPageClickFirst:function(){
                if (this.pagenum<=1){
                    return;
                }
                this.pagenum=1;
                this._eventSearch(false);
            },
            _divPageClickPre:function(){
                if (this.pagenum<=1){
                    return;
                }
                this.pagenum=parseInt(this.pagenum.toString()) - parseInt("1");
                this._eventSearch(false);
            },
            _divPageClickNum:function(numclick){
                this.pagenum=numclick;
                this._eventSearch(false);
            },
            _divPageClickNext:function(){
                if (this.pagenum>=this.pagecount){
                    return;
                }
                this.pagenum=parseInt(this.pagenum.toString()) + parseInt("1");
                this._eventSearch(false);
            },
            _divPageClickLast:function(){
                if (this.pagenum>=this.pagecount){
                    return;
                }
                this.pagenum=this.pagecount;
                this._eventSearch(false);
            },
            _showMsg:function (msginfo) {
                // alert(msginfo);
                L.ict.app.util.dialog.warn($.i18n.prop('dialog_alert_title'),msginfo);

            },
            _showErrorMsg:function (errormsg) {
                // alert(errormsg);
                L.ict.app.util.dialog.error($.i18n.prop('dialog_alert_title'),errormsg);                                                
                
            }

    })

});

});

