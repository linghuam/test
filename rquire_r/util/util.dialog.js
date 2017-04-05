
define("util/dialog",[
  "leaflet",
  "core/namespace"
  
],function(L){
    /*
    * 模态对话框类
    *使用示例
      new L.ICT.Dialog().confirm("信息提示","确认重新发送请求吗？",function(e){
        console.log(e);
      });
    */
   L.ICT.Util.Dialog = L.Class.extend({
        /**
        *界面主体
        *@property _body
        *@type {String}
        *@private
        */
        _body: '<div class="modal fade" id="modal-dialog">'
                + '<div class="modal-dialog modal-sm">'
                + '<div class="modal-content">'
                + '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '<h5 class="modal-title" id="modal-title">标题</h5>'
                + '</div>'
                + '<div class="modal-body">'
                + '<img class="infoImg" src="themes/images/dialog/error.png" style="width:30px;height:30px;">'
                + '<p id="modal-text">内容</p>'
                + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" class="btn btn-primary common_btn_ok" id="modal-todo">确认</button>'
                + '<button type="button" class="btn btn-primary common_btn_cancel" data-dismiss="modal" id="modal-close">取消</button>'
                + '</div></div></div></div>',
        /**
        *容器
        *@property _container
        *@type {Object}
        *@private
        */
        _container: null,

        /**
        *初始化
        *@method initialize
        */
        initialize: function () {
            this._container = L.DomUtil.create("div", "", document.body);
            this._container.innerHTML = this._body;
            this._setCss();
            L.DomEvent.addListener(L.DomUtil.get("modal-close"), "click", function () {
                this._close();
            }, this);
        },           

        /**
        *信息框 只弹出信息，不显示图片
        *@method alert
        *@param title {String} 提示框标题
        *@param text {String} 提示框显示内容
        */
        alert: function (title, text) {
            this._setClose(false);
            this._setDialog(title, text);
            this._setImg(null);
            this._show();            
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click", this, function (event) {
                event.data._close();
            });
        },

        /**
        *成功弹框 弹出成功提示信息 显示成功图片
        *@method success
        *@param title {String} 提示框标题
        *@param text {String} 提示框显示内容
        */
        success: function (title, text) {
            this._setClose(false);
            this._setDialog(title, text);
            this._setImg("success");
            this._show();            
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click", this, function (event) {
                event.data._close();
            });
        },           

        /**
        *错误框 显示错误图片
        *@method error
        *@param title {String} 提示框标题
        *@param text {String} 提示框显示内容
        */
        error: function (title,text) {
            this._setClose(false);
            this._setDialog(title, text);
            this._setImg("error");
            this._show();
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click", this, function (event) {
                event.data._close();
            });
        },

        /**
        *警告框 显示警告图片
        *@method warn
        *@param title {String} 提示框标题
        *@param text {String} 提示框显示内容
        */
        warn: function (title,text) {
            this._setClose(false);
            this._setDialog(title, text);
            this._setImg("warn");
            this._show();
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click", this, function (event) {
                event.data._close();
            });
        },        

        /**
        *确认框
        *@method confirm
        *@param title {String} 提示框标题
        *@param text {String} 提示框显示内容
        *@param callback {Function} 回调函数
        */
        confirm: function (title,text,callback) {
            this._setClose(true);
            this._setDialog(title, text);
            this._setImg(null);
            this._show();
            $("#modal-todo").unbind();
            $("#modal-todo").bind("click",this, function (event) {
                event.data._close();
                callback();
            });
            $("#modal-close").bind("click", this, function (event) {
                event.data._close();
            });
        },

        _setImg:function(type){
            var $img =  $(this._container).find(".infoImg");
            if(type === "success"){
                $img.attr("src","themes/images/dialog/success.png");

            } else if(type === "error"){
                $img.attr("src","themes/images/dialog/error.png");

            } else if( type === "warn"){
                $img.attr("src","themes/images/dialog/warn.png");

            } else {
                $img.remove(); //如果没有，则移除图片
            }

        },

        _setCss:function(){   

           // $(this._container).css({
           //    "display":"none"
           // });
           $(this._container).find(".modal-dialog").css({
                "margin":"260px auto"
           });

           $(this._container).find(".modal-header").css({
                "padding": "5px",
                "text-align": "center",
                "color": "#fff",
                "background-color": "#1c5da9"
           });
          $(this._container).find(".modal-header button span").css({
             "font-size": "16px", 
             "color":"#fff",
             "line-height":"20px"
          });
          $(this._container).find(".modal-body").css({
             "text-align": "center"
          });
          $(this._container).find(".modal-body p").css({
             "font-size": "16px",
             "font-weight":"500",
             "margin":"5px"
          });
          $(this._container).find(".modal-footer").css({
                "text-align":"center",
                "padding":"5px",
                "border":"none"
          });
          $(this._container).find(".modal-footer .btn").css({

          });

        },

        /**
        *关闭提示框
        *@method _close
        *@private
        */
        _close: function () {
            $('#modal-dialog').modal('hide');
        },

        /**
        *显示提示框
        *@method _show
        *@private
        */
        _show: function () {
            //中英文
            $('#modal-dialog').find('.common_btn_ok').html($.i18n.prop('common_btn_ok'));
            $('#modal-dialog').find('.common_btn_cancel').html($.i18n.prop('common_btn_cancel'));
            
            $('#modal-dialog').modal("show");
        },

        /**
        *设置提示框显示
        *@method _setDialog
        *@private
        */
        _setDialog: function (title,text) {
            L.DomUtil.get("modal-title").innerHTML = title;
            L.DomUtil.get("modal-text").innerHTML = text;
        },

        /**
        *设置关闭按钮显示
        *@method _setClose
        *@private
        */
        _setClose: function (visible) {
            if (visible == true) {
                L.DomUtil.get("modal-close").style.display = "";
            }else
                L.DomUtil.get("modal-close").style.display = "none";
        }

   });

});
