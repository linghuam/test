/*
*时间日期转换模块
*/
define("util/dateTime",[
  "leaflet",
  "core/namespace"
  
],function(L){

    L.ICT.Util.DateTime = L.Class.extend({
       
        initialize:function(){

        },

        //获取当前日期的前一定小时的时间
        getNewDateTimeBeforHour:function(beforeH){
            var newDate=new Date();
            newDate = newDate.valueOf();
            newDate = newDate- beforeH*60 * 60 * 1000;
            newDate = new Date(newDate)
            return newDate;
        },

        //得到特定格式(yy-mm-dd hh:mm:ss)时间的unix时间戳
        getCusUnixTime: function(sjstr){
            var sjsplit = sjstr.split(" ");
            var ymd = sjsplit[0].split("-");
            var hms = sjsplit[1].split(":");
            var year = parseInt(ymd[0]);
            var month = parseInt(ymd[1])>0 ? parseInt(ymd[1])-1 : 0;
            var day = parseInt(ymd[2]);
            var hour = parseInt(hms[0]);
            var minutes = parseInt(hms[1]);
            var seconds = parseInt(hms[2]);
            var d = new Date(year,month,day,hour,minutes,seconds);
            return d.valueOf()/1000;    
        }, 

        //得到当前时间的unix时间戳
        getCurrentUnixTime: function(){
            var d = new Date();
            return parseInt(d.valueOf()/1000);
        },              
        
        //将格式为（yy-mm-dd hh-mm-ss）的日期转为数值          
        getDateFromformatFull:function(datestring){
            var ary1=datestring.split(" ");
            var arydate=ary1[0].split("-");
            var arytime=ary1[1].split(":");
            var y=parseInt(arydate[0]);
            var mm=parseInt(arydate[1]);
            var d=parseInt(arydate[2]);
            var h=parseInt(arytime[0]);
            var m=parseInt(arytime[1]);
            var s=parseInt(arytime[2]);     
            var retdate=new Date(y,mm,d,h,m,s); 
            return retdate;
        },
        
        //将日期转化为（yy-mm-dd hh-mm-ss）格式的日期字符串
        formatDateFULL:function(newDate){
            var year=newDate.getFullYear();
            var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
            var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
            var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
            var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
            var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
            var ret=year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds;
            return ret;
        },
        
        //将日期转化为（yy-mm-dd hh）格式的日期字符串
        formatDateH:function(newDate){
            var year=newDate.getFullYear();
            var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
            var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
            var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
            var ret=year+"-"+month+"-"+day+" "+hours;
            return ret;
        },
        
        //将日期转化为（yy-mm-dd hh-mm）格式的日期字符串
        formatDateHM:function(newDate){
            var year=newDate.getFullYear();
            var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
            var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
            var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
            var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
            var ret=year+"-"+month+"-"+day+" "+hours+":"+minuts;
            return ret;
        },

        /*根据unix时间戳获取时间字符串*/
        getTimeStrFromUnix: function(time){
            time = parseInt(time);
            if(isNaN(time)){
                return "";
            }
             var newDate = new Date(time*1000);
            // var newDate = new Date(time);    
            var year=newDate.getFullYear();
            var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
            var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
            var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
            var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
            var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
            var ret=year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds;
            return ret;            
        },    

        /*
        *获取当前时间
        */
        getTimeString:function () {
            var d = new Date(),
                  year = d.getFullYear().toString(),
                  month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString(),
                  day = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString(),
                  hour = d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours().toString(),
                  minutes = d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString(),
                  seconds = d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds().toString();
            return year + month + day + hour + minutes + seconds;
        },
        
        /*
        *获取指定格式日期
        */
        getDate: function (pattern,date) {
            var d = date ? date : new Date(),
                  year = d.getFullYear().toString(),
                  fmonth = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString(),
                  month = (d.getMonth() + 1).toString(),
                  fday = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString(),
                  day = d.getDate().toString(),
                  fhour = d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours().toString(),
                  hour = d.getHours().toString(),
                  fminutes = d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes().toString(),
                  minutes = d.getMinutes().toString(),
                  fseconds = d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds().toString(),
                  seconds = d.getSeconds().toString();
                  switch (pattern) {
                      case "yyyyMMddhhmmss": return year + fmonth + fday + fhour + fminutes + fseconds; break;
                      case "yyyyMMdd": return year + fmonth + fday; break;
                      case "yyyy/MM/dd": return year + "/" + fmonth + "/" + fday; break;
                      case "yyyy/M/d": return year + "/" + month + "/" + day; break;
                      case "yyyy-MM-dd": return year + "-" + fmonth + "-" + fday; break;
                      case "yyyy-M-d": return year + "-" + month + "-" + day; break;
                      default: return { year: year, month: month, day: day, hour: hour, minutes: minutes, seconds: seconds };
                  }
        },		

        /*
        * 验证开始时间和结束时间
        */
        checkStrartEndTime:function(startsj,endsj,range){
            var tip1 = $.i18n.prop('common_time_error1');
            var tip2 = $.i18n.prop('common_time_error2');
            var tip3 = $.i18n.prop('common_time_error3',range);
            var startsjnew=this.getDateFromformatFull(startsj);
            var endsjnew=this.getDateFromformatFull(endsj);                           
            startsjnew=startsjnew.valueOf();
            endsjnew=endsjnew.valueOf();
            if (startsjnew > endsjnew){
                return {result:false,msg:tip1};
            }else{
                var sjc=range*24*60*60*1000;
                var sjsjc=endsjnew-startsjnew;
                if (sjsjc > sjc){
                    var res = (range >= 30 ? tip2 : tip3);
                    return {result:false,msg:res};
                }
            }
            return {result:true,msg:""};;
        }        

    });

});