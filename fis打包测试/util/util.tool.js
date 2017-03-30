
define("util/tool",[
  "leaflet",
  "core/namespace"
  
],function(L){


    L.ICT.Util.Tool = L.Class.extend({
       
       initialize:function(){

       },
       
       /**
        *有约束区域拖拽
        *@method _drag
        *@param _body {String} 待移动元素id 父元素
        *@param _pannel {String} 约束元素id 子元素
        */
        drag:function(_body,_pannel){
            var dragging = false;
            var iX, iY;
            var pannel = $('#' + _pannel);
            var body = $('#' + _body);
            var uKey = "drag_" + L.stamp(body);

            //pannel.css("cursor", "move");
            pannel.data("drag", "drag");
            pannel.data("panel", uKey);
            body.addClass(uKey);

            if (!this.initDrag) {
                this.initDrag = true;

                $(document).mousedown(function (e) {
                    body = null;
                    pannel = null;

                    pannel = $(e.target);
                    pannel = pannel.data("drag") ? pannel : pannel.parent();
                    if (pannel.data("drag") && pannel.data("drag") == "drag" && pannel.data("panel")) { } else { return; }
                    dragging = true;

                    body = pannel.closest('.' + pannel.data("panel"));
                    if (body.length == 0) return;

                    body = body[0];

                    iX = e.clientX;
                    iY = e.clientY;

                    var point = L.DomUtil.getPosition(body);
                    if (point) {
                        iX = iX - point.x;
                        iY = iY - point.y;
                    }
                    //body.setCapture && body.setCapture();
                    return false;
                });

                $(document).mousemove(function (e) {
                    if (dragging && body) {
                        var e = e || window.event;
                        var oX = e.clientX - iX;
                        var oY = e.clientY - iY;

                        var point = L.point(oX, oY);
                        L.DomUtil.setPosition(body, point);
                        return false;
                    }
                });

                $(document).mouseup(function (e) {
                    //var se = document.getElementById(_body);
                    dragging = false;
                    iX = null;
                    iY = null;
                    pannel = null;
                    body = null;
                    uKey = null;
                    //  se.releaseCapture;
                    //e.cancelBubble = true;
                });
            }           

        },
        
        /*经纬度转化为度分秒
        *@val Number 经纬度数值  经度范围：-180——180 纬度范围：-90——90
        *@latlngtype String 数值类型 lat-纬度 lng-经度
        *@iskeepCapacity 是否保证经纬度的位数 默认为是
        *@spointCount Number option 秒保留的小数点位数 没指定默认为整数
        *示例1： L.ict.util.latlngTodfm(37.534,'lat') ——> [37, 32, 32, "N"]
        *示例2： L.ict.util.latlngTodfm(117.128,'lng',2) ——> [117, 7, "40.80", "E"]
        */ 
        latlngTodfm:function(val,latlngtype,iskeepCapacity,spointCount){
            var resobj = [],dir;
            newval = parseFloat(val);
            var positiveNum = Math.abs(newval);
            var du = parseInt(positiveNum);
            var fen = parseInt(positiveNum*60) - du*60;
            var miao = positiveNum*60*60 - fen*60 - du*60*60 ;
            if(typeof spointCount==='undefined' || spointCount<=0) {spointCount = 0;}
            miao = miao.toFixed(spointCount);
            if(typeof iskeepCapacity==='undefined') {iskeepCapacity=true;}
            if(iskeepCapacity){
                if(latlngtype === 'lng'){
                    if(du<10) du = '00'+du;
                    if(du>=10 && du<100) du = '0'+du;
                } else{
                    if(du<10) du = '0'+du;
                }
                // if(fen<10) fen = '0'+fen;
                // if(miao<10 && spointCount===0) miao = '0'+miao;

            }
            if(latlngtype === 'lat'){
                if(newval <0) dir = 'S';
                else dir='N';
            }
            if(latlngtype === 'lng'){
                if(newval<0) dir = 'W';
                else dir = 'E';
            }
            resobj.push(du,fen,miao,dir);
            return resobj;
        },

        latlngTodfmStr: function(val,latlngtype,spointCount){
            var res = this.latlngTodfm(val,latlngtype,spointCount);    
            var str = res[3] + " " + res[0] + "°" + res[1] + "′" + res[2] + "″";
            return str;
                
        },      
        
        /*四舍五入，保留位数为roundDigit*/
        formatStr:function(numberRound,roundDigit){ 
            if (numberRound.indexOf(".")>=0){
                var alllen=numberRound.length;
                var lencz=alllen-numberRound.indexOf(".");
                var xswall=lencz-1;
                if (xswall<=roundDigit){
                    return numberRound;
                }else{
                    var indexend=numberRound.indexOf(".")+roundDigit+1;
                    return numberRound.substr(0,indexend);   
                }
            }else{
                return numberRound;
            }           

        },
        
        /*经度整数部分始终显示三位数*/
        formatLng:function(lng){

            return lng < 10 ? '00'+lng : (lng<100 ? '0'+lng : lng);

        },
        
        /*纬度整数部分始终显示两位数*/
        formatLat:function(lat){

           return lat < 10 ? '0'+lat : lat;
           
        },

        /*
        *得到unix时间戳(算法有问题)
        *输入格式  "2017-01-02 10"
        */
        // getUnixTime:function(sjstr){
        //     sjstr = sjstr+':00:00';
        //     var sjsplit = sjstr.split(" ");
        //     var ymd = sjsplit[0].split("-");
        //     var hms = sjsplit[1].split(":");
        //     var year = parseInt(ymd[0]);
        //     var month = parseInt(ymd[1])>0 ? parseInt(ymd[1])-1 : 0;
        //     var day = parseInt(ymd[2]);
        //     var hour = parseInt(hms[0]);
        //     var minutes = parseInt(hms[1]);
        //     var seconds = parseInt(hms[2]);
        //     var d = new Date(year,month,day,hour,minutes,seconds);
        //     return d.valueOf()/1000;
        // },
        
        /*根据unix时间戳获取时间字符串*/
        // getTimeStrFromUnix: function(time){
        //     time = parseInt(time);
        //     if(isNaN(time)){
        //         return "";
        //     }
        //     var newDate = new Date(time*1000);
        //     // var newDate = new Date(time);    
        //     var year=newDate.getFullYear();
        //     var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
        //     var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
        //     var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
        //     var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
        //     var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
        //     var ret=year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds;
        //     return ret;
            
        // },


        //得到当前时间的unix时间戳
        // getCurrentUnixTime: function(){
        //     var d = new Date();
        //     return d.valueOf()/1000;
        // },

        //得到特定格式(yy-mm-dd hh:mm:ss)时间的unix时间戳
        // getCusUnixTime: function(sjstr){
        //     var sjsplit = sjstr.split(" ");
        //     var ymd = sjsplit[0].split("-");
        //     var hms = sjsplit[1].split(":");
        //     var year = parseInt(ymd[0]);
        //     var month = parseInt(ymd[1])>0 ? parseInt(ymd[1])-1 : 0;
        //     var day = parseInt(ymd[2]);
        //     var hour = parseInt(hms[0]);
        //     var minutes = parseInt(hms[1]);
        //     var seconds = parseInt(hms[2]);
        //     var d = new Date(year,month,day,hour,minutes,seconds);
        //     return d.valueOf()/1000;    
        // },               
                
        /*米转化为海里*/
        convertMileToNmile:function(mileVal){
             var oval = parseFloat(mileVal);
             var newval = oval*0.00054;
             return newval.toFixed(3);
        },

        /*
        * 安排函数f()在未来的调用模式
        * 在等待了若干毫秒之后调用f()
        * 如果设置了interval并没有设置end参数，则对f()调用将不会停止
        * 如果没有设置interval和end，只在若干毫秒后调用f一次
        * 只有指定了f,才会从start=0的时刻开始
        * 注意，调用invoke不会阻塞，它会立即返回
        */
        invoke:function(f,start,interval,end){
            if(!start) start = 0; //默认设置为0 毫秒
            if(arguments.length <=2)
                setTimeout(f,start); //若干毫秒后的单次调用模式
            else{
                setTimeout(repeat,start); //在若干毫秒后调用repeat()
                function repeat(){
                     var h = setInterval(f,interval); //循环调用f()
                     //在end毫秒后停止调用
                     if(end) setTimeout(function(){clearInterval(h);},end);
                }
            }

        }

         
    });

});