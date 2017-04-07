
define("func/jrtx",[
    "leaflet",
    "func/base",
    "control/panel",
    "plugins/mcscroll",
    "data/ajax",
    "layout/menu"

],function(L){

    L.ICT.Func.add("jrtx",{

        id:'jrtx',

        Class: L.Class.extend({

            initialize:function(){
                this.menu = L.ict.app.menu;
                this.util = L.ict.app.util;
                this.dateUtil = L.ict.app.util.dateTime;
                this.ajax = new L.ICT.Ajax();
                this.config = Project_ParamConfig.cdglConfig;
                this.menuid = 'ict_menu_main_jrtx';
                this._popPanel = null;

                this._pageInfoInit();
            },
            start:function(){
                //登录提示
                if(!L.ICT.Func["UserLogin"].getInstance().isLogin()){
                    L.ICT.Func["UserLogin"].getInstance().alertLoginDialog();                    
                    return;
                 }  
                if(this._popPanel) return;
                this._initUI();
                this._initEvts();

                this._eventSearch(true);
            },

            stop:function(){
                if(this._popPanel) this._popPanel.remove();
            },
            _initUI:function(){
                var func_jrtx_titlename=$.i18n.prop('func_jrtx_titlename');
                var options = {
                    title:func_jrtx_titlename,
                    width:720,
                    height:450,
                    top:200,
                    left:400,
                    contentHTML:this._getContentHTML()
                };
                var pop = this._popPanel = new L.ICT.PopPanel(options);
                pop.show();
            },
            _initEvts:function(){
                    self = this;

                this._popPanel.on("popPanelRemove",function(){
                    this._popPanel = null;
                    this.menu.mainmenu.deactiveMenu(this.menuid);
                },this);
            },
            _getContentHTML:function(){
                var func_jrtx_lb_tx=$.i18n.prop('func_jrtx_lb_tx');
                var html = [];
                html.push('<TABLE border=0 style="width:700px;height:380px;font-family:Microsoft Yahei;font-size:12px;" cellspacing="0">');
                html.push('	<TR>');
                html.push('		<TD style="width:100%;height:30px;line-height:30px;text-align:left;vertical-align:middle;padding-left:10px;">');
                html.push('			<input type="text" id="jrtx_lb_tx" class="jrtx_input_lb" style="width:270px" value="'+func_jrtx_lb_tx+'"/>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('	<TR>');
                html.push('		<TD width=700px height="350px";align=center valign=top>');
                html.push('			<div id="jrtx_dialog_event_list" style="width:100%;height:340px;padding-left:10px;padding-right:10px;"></div>');
                html.push('			<div id="jrtx_div_page" style="width:100%;height:30px;text-align:right;padding-right:20px;"></div>');
                html.push('		</TD>');
                html.push('	</TR>');
                html.push('</TABLE>');
                return html.join('');
            },
			formatDateNow:function(){
				var newDate=new Date();
				var year=newDate.getFullYear();
				var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
				var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
				var ret=year+"-"+month+"-"+day;
				return ret;
			},
            getNewDateTimeBeforHour:function (beforeH) {
                var newDate=new Date();
                newDate = newDate.valueOf();
                newDate=newDate- beforeH*60 * 60 * 1000;
                newDate = new Date(newDate)
                return newDate;
            },
            formatDateFULL:function (newDate) {
                var year=newDate.getFullYear();
                var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
                var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
                var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
                var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
                var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
                var ret=year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds;
                return ret;
            },
            _eventGetSearchWhere:function () {
                var nowsj = new Date();
                var sj1=this.getNewDateTimeBeforHour(24);
                var sjstart=this.formatDateFULL(sj1);
                var sjend=this.formatDateFULL(nowsj);
                var data={};

                data.timespane=nowsj.getTime().toString();
                data.shipidstr="";
                data.ischeckshipid="0";
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
                if (data!=null &&  data.rec!=null && data.rec.length>0){
                    var func_jrtx_lb_tx=$.i18n.prop('func_jrtx_lb_tx');
                    $("#jrtx_lb_tx").val(func_jrtx_lb_tx);
                }else{
                    $("#jrtx_lb_tx").val("");
                }

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

                if (reclist!=null && reclist.length>0){
                    htmlstr=htmlstr+'<tr style="background-color:'+rowbackcolor+';width:100%;height:30px;line-height:30px;text-align:left;">';
                    htmlstr=htmlstr+'<td style="width:50px;height:100%;text-align:center;vertical-align:middle;">';
                    htmlstr=htmlstr+func_cdgl_datagrid_xh;
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'<td style="width:150px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr=htmlstr+func_cdgl_datagrid_shipName;
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr=htmlstr+'MMSI';
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'<td style="width:160px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr=htmlstr+func_cdgl_datagrid_time;
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr=htmlstr+func_cdgl_datagrid_state;
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'<td style="width:180px;height:100%;text-align:left;vertical-align:middle;">';
                    htmlstr=htmlstr+func_cdgl_datagrid_portName;
                    htmlstr=htmlstr+'</td>';
                    htmlstr=htmlstr+'</tr>';
                    for (var k=0;k<reclist.length;k++){
                        if (rowbackcolor=="#e6effe"){
                            rowbackcolor="#ffffff";
                        }else{
                            rowbackcolor="#e6effe";
                        }
                        htmlstr=htmlstr+'<tr style="background-color:'+rowbackcolor+';width:100%;height:30px;line-height:30px;text-align:left;">';
                        htmlstr=htmlstr+'<td style="width:50px;height:100%;text-align:center;vertical-align:middle;">';
                        htmlstr=htmlstr+(k+1).toString();
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'<td style="width:150px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr=htmlstr+reclist[k].ship_name;
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr=htmlstr+reclist[k].mmsi;
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'<td style="width:160px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr=htmlstr+reclist[k].sj_str;
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'<td style="width:80px;height:100%;text-align:left;vertical-align:middle;">';
                        var lanset=window.localStorage.getItem("language");
                        var state1=reclist[k].state_name;
                        var stateconvert="";
                        if (state1=="进港"){
                            stateconvert=$.i18n.prop('func_cdgl_datagrid_state_jg');
                        }else if (state1=="出港"){
                            stateconvert=$.i18n.prop('func_cdgl_datagrid_state_cg');
                        }
                        htmlstr=htmlstr+stateconvert;
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'<td style="width:180px;height:100%;text-align:left;vertical-align:middle;">';
                        htmlstr=htmlstr+reclist[k].port_name;
                        htmlstr=htmlstr+'</td>';
                        htmlstr=htmlstr+'</tr>';
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
                $('#jrtx_dialog_event_list').html(htmlstr);
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
                var htmlstr='<label id="divPageFirst" class="jrtx_page_first"  onclick="self._divPageClickFirst();">'+func_cdgl_page_first+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>';
                for (var k=0;k<this.curShowPageLabelAry.length;k++)
                {
                    htmlstr=htmlstr+'<label class="jrtx_page_numlabel_noselect" id="divPageNumLabel_'+this.curShowPageLabelAry[k]+'" onclick="self._divPageClickNum('+this.curShowPageLabelAry[k]+');">'+this.curShowPageLabelAry[k]+'</label>';
                }
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="jrtx_page_last"  onclick="self._divPageClickLast();">'+func_cdgl_page_last+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="jrtx_page_pre"  onclick="self._divPageClickPre();">'+func_cdgl_page_previous+'</label>';
                htmlstr=htmlstr+'<label>&nbsp</label>'
                htmlstr=htmlstr+'<label id="divPageLast" class="jrtx_page_next" onclick="self._divPageClickNext();">'+func_cdgl_page_next+'</label>';

                $('#jrtx_div_page').html(htmlstr);
            },
            //设置当前页label的样式
            _DivPageNumLabelSetCur:function () {
                for (var i=0;i<this.curShowPageLabelAry.length;i++){
                    if (this.curShowPageLabelAry[i]==this.pagenum){
                        $("#divPageNumLabel_"+this.curShowPageLabelAry[i]).attr("class", "jrtx_page_numlabel_select");
                    }else{
                        $("#divPageNumLabel_"+this.curShowPageLabelAry[i]).attr("class", "jrtx_page_numlabel_noselect");
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

