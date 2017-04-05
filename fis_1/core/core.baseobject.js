/**
*基类
*@module core
*@class ICT.BaseObject
*@constructor initialize
*/
define("core/baseobject", [
    "leaflet",
    "core/namespace"
], function (L) {
    
    L.ICT.BaseObject = L.Class.extend({
        
        includes: L.Mixin.Events,
        /**
        *对象id
        *
        *@property id
        *@type {String}
        */
        id: null,
        
        initialize:function() {
            
        },

        /**
        *获取当前对象类型
        *
        *@method getType
        *@return {String} 当前对象类型
        */
        getType: function () {
            return typeof this;
        }
    });

    return L.ICT.BaseObject;
});