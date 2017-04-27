/*
 *全屏功能模块
 */
define("func/fullscreen", ["leaflet"], function(L) {

    L.ICT.Func.add("FullScreen", {

        Class: L.Class.extend({

            initialize: function(element) {
                this.ictmap = L.ict.app.ictmap;
                this.menu = L.ict.app.menu;
                this.menuid = 'ict_menu_main_qpxs';
                this.el = element || $('body')[0];
            },

            start: function() {
                var self = this;
                fullScreenApi.requestFullScreen(this.el);
                setTimeout(function() {
                    L.ict.app.ictmap._initMapStyle();
                    L.ict.app.ictmap.map.invalidateSize(false);
                    self._updateImg(true);
                }, 100);
            },

            stop: function() {
                var self = this;
                fullScreenApi.cancelFullScreen();
                setTimeout(function() {
                    L.ict.app.ictmap._initMapStyle();
                    L.ict.app.ictmap.map.invalidateSize(false);
                    self._updateImg(false);
                }, 100);
            },

            _updateImg: function(isfullscreen) {
                if (isfullscreen) {
                    $('#ict_menu_main_qpxs').attr('title', '退出全屏');
                    $('#ict_menu_main_qpxs').find('img').attr('src', 'themes/images/frame/menu_min.png');
                } else {
                    $('#ict_menu_main_qpxs').attr('title', '全屏显示');
                    $('#ict_menu_main_qpxs').find('img').attr('src', 'themes/images/frame/menu_max.png');
                }
            }
        })
    });

    //禁止按f11键全屏，因为按F11不能触发onfullscreenchange事件
    window.addEventListener("keydown", function(event) {
        if (event.keyCode === 122) {
        	event.preventDefault();
        }
    }, true);

    //注册全屏事件
    document.onfullscreenchange = function() {
        if (fullScreenApi.isFullScreen()) {
            L.ict.app.menu.mainmenu.activeMenu('ict_menu_main_qpxs');
        } else {
            L.ict.app.menu.mainmenu.deactiveMenu('ict_menu_main_qpxs');
        }
    };
    document.onwebkitfullscreenchange = function() {
        if (fullScreenApi.isFullScreen()) {
            L.ict.app.menu.mainmenu.activeMenu('ict_menu_main_qpxs');
        } else {
            L.ict.app.menu.mainmenu.deactiveMenu('ict_menu_main_qpxs');
        }
    };
    document.onmozfullscreenchange = function() {
        if (fullScreenApi.isFullScreen()) {
            L.ict.app.menu.mainmenu.activeMenu('ict_menu_main_qpxs');
        } else {
            L.ict.app.menu.mainmenu.deactiveMenu('ict_menu_main_qpxs');
        }
    };
    document.onmsfullscreenchange = function() {
        if (fullScreenApi.isFullScreen()) {
            L.ict.app.menu.mainmenu.activeMenu('ict_menu_main_qpxs');
        } else {
            L.ict.app.menu.mainmenu.deactiveMenu('ict_menu_main_qpxs');
        }
    };


    /* 
    Native FullScreen JavaScript API
    -------------
    Assumes Mozilla naming conventions instead of W3C for now

    source : http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/

    */

    var
        fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() {
                return false;
            },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.exitFullscreen !== 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] !== 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
        if (typeof document['msExitFullscreen'] !== 'undefined') {
            fullScreenApi.prefix = 'ms';
            fullScreenApi.supportsFullScreen = true;
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        if (fullScreenApi.prefix === 'ms') {
            fullScreenApi.fullScreenEventName = 'MSFullscreenChange';
        } else {
            fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        }
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullscreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                case 'ms':
                    return document.msFullscreenElement;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        };
        fullScreenApi.requestFullScreen = function(el) {
            switch (this.prefix) {
                case '':
                    return el.requestFullscreen();
                case 'ms':
                    return el.msRequestFullscreen();
                default:
                    return el[this.prefix + 'RequestFullScreen']();
            }
        };
        fullScreenApi.cancelFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.exitFullscreen();
                case 'ms':
                    return document.msExitFullscreen();
                default:
                    return document[this.prefix + 'CancelFullScreen']();
            }
        };
    }

    // jQuery plugin
    if (typeof jQuery !== 'undefined') {
        jQuery.fn.requestFullScreen = function() {
            return this.each(function() {
                var el = jQuery(this);
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(el);
                }
            });
        };
    }

    // export api
    window.fullScreenApi = fullScreenApi;
});
