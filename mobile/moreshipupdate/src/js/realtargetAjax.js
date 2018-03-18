import L from 'leaflet'
import $ from 'jquery'
import { Config } from '../config/index.js'
import { Ajax } from './ajax.js'
import { Draw } from './draw.ship.js'

export class RealTarget {

    constructor(map) {

        this._map = map;
        this._draw = new Draw(map, this);
        this._ajax = new Ajax();
        this._webworker = new Worker('src/js/webworker.js');
        this._alltargets = [];

        this._isAjaxComplete = 0;
        this._lastFpsUpdateTime = 0;

        this._map.on('moveend', function () {
            this.getData();
        }, this);

        this._webworker.onmessage = this._onWebworkerMessage.bind(this);
    }

    updateSelectState(obj) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            let target = this._alltargets[i];
            if(obj.id === target.id) {
                target.eventTag.isSelect = 1;
            } else {
                target.eventTag.isSelect = 0;
            }
        }
    }

    getTargetById(id) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            if(id === this._alltargets[i].id) {
                return this._alltargets[i];
            }
        }
    }

    getCurRectExtend() {
        var obj = {};
        var bounds = this._map.getBounds().pad(Config.bufferRatio);
        var southwest = bounds.getSouthWest();
        var northeast = bounds.getNorthEast();
        obj.ldlon = parseFloat(southwest.lng.toFixed(6))
        obj.ldlat = parseFloat(southwest.lat.toFixed(6))
        obj.rulon = parseFloat(northeast.lng.toFixed(6))
        obj.rulat = parseFloat(northeast.lat.toFixed(6))
        return obj
    }

    getData(isAtOnce = true) {
        // 限制发送请求的频率，改善用户体验
        if(!isAtOnce) {
            var timestamp = this._caculatefpsTime(+new Date());
            if(timestamp >= 2 * 1000 && this._isAjaxComplete === 1) {
                this._isAjaxComplete = 0;
                this._getData();
            }
        } else {
            this._getData();
        }
    }

    _getData() {
        var url = Config.shipRealUrl;
        var data = {};
        data.limit = Config.limit;
        data.timeout = Config.timeout;
        data.mode = Config.CurrentMode;
        data = L.extend(data, this.getCurRectExtend());
        this._ajax.abort();
        this._ajax.post(url, data, true, this, this._getRectTargetCallback);
        this._stopInterval();
        this._interval = window.setInterval(function () {
            if(this._isAjaxComplete === 1) {
                this._isAjaxComplete = 0;
                this._ajax.post(url, data, true, this, this._getRectTargetCallback)
            }
        }.bind(this), Config.updatetime * 1000);
    }

    // 计算两帧时间间隔，单位：毫秒
    _caculatefpsTime(now) {
        var time = now - this._lastFpsUpdateTime;
        if(this._lastFpsUpdateTime === 0) {
            time = 0;
        }
        this._lastFpsUpdateTime = now;
        return time;
    }

    _getRectTargetCallback(data, error) {
        this._isAjaxComplete = 1;
        if(error) {
            console.error('获取目标错误！');
            return;
        }
        if(data.state !== 1) {
            console.error('未获取指定区域目标！');
            return;
        }
        console.log('获取目标总数:' + data.msg.shipList.length);
        this._webworker.postMessage({
            newdata: data,
            olddata: this._alltargets,
            mode: Config.CurrentMode
        });
    }

    _onWebworkerMessage(e) {
        // 先更新数据再绘制，不然会丢失绘制之前的事件状态
        this._alltargets = this._updateEventTag(e.data);
        this._draw.drawShips(e.data, function () {
            // this._alltargets = e.data;
        }.bind(this));
    }

    _updateEventTag(data = []) {
        for(let i = 0, len = data.length; i < len; i++) {
            let starget = data[i];
            for(let j = 0, lenj = this._alltargets.length; j < lenj; j++) {
                let ttarget = this._alltargets[j];
                if(starget.id === ttarget.id) {
                    starget.eventTag = Object.assign({}, starget.eventTag, ttarget.eventTag);
                    break;
                }
            }
        }
        return data;
    }

    _stopInterval() {
        if(this._interval) {
            window.clearInterval(this._interval);
            this._interval = null;
        }
    }
}
