import L from 'leaflet'
import $ from 'jquery'
import { Config } from '../config/index.js'
import { MyWebSocket } from './mywebsocket.js'
import { Draw } from './draw.ship.js'

export class RealTarget {

    constructor(map) {

        this._map = map;
        this._draw = new Draw(map, this);
        this._websocket = new MyWebSocket('ws://localhost:8181');
        this._webworker = new Worker('src/js/webworker.js');
        this._alltargets = [];

        this._lastFpsUpdateTime = 0;

        this._map.on('moveend', function () {
            this.getData();
        }, this);

        this._websocket.onMessage(this._getRectTargetCallback.bind(this));
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
            if(timestamp >= 2 * 1000) {
                this._websocket.sendMessage(this._getParamData());
            }
        } else {
            this._websocket.sendMessage(this._getParamData());
        }
    }

    _getParamData() {
        var param = {};
        var data = {};
        data.limit = Config.limit;
        data.timeout = Config.timeout;
        data.mode = Config.CurrentMode;
        data = Object.assign(data, this.getCurRectExtend());
        param.url = Config.shipRealUrl;
        param.data = data;
        return param;
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

    _getRectTargetCallback(e) {
        var data = JSON.parse(e.data);
        // console.log(data);
        console.log('获取目标总数:' + data.msg.shipList.length);
        this._webworker.postMessage({
            newdata: data,
            olddata: this._alltargets
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
}
