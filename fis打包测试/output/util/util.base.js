define("util/base",["leaflet","core/namespace","util/dialog","util/tool","util/dateTime"],function(i){return i.ICT.Util.Base=i.Class.extend({dialog:null,tool:null,dateTime:null,initialize:function(){this.dialog=new i.ICT.Util.Dialog,this.tool=new i.ICT.Util.Tool,this.dateTime=new i.ICT.Util.DateTime}}),i.ICT.Util.Base});