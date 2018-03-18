export class Targets {

    constructor(targets = []) {
        this.alltargets = this._alltargets = [];
        this.addTargets(targets);
    }

    addTarget(t) {
        this._alltargets.push(t);
    }

    removeTarget(id) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            if(id === this._alltargets[i].id) {
                this._alltargets.splice(i, 1);
                break;
            }
        }
    }

    updateTarget(t) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            let st = this._alltargets[i];
            if(t.id === st.id) {
                this._alltargets[i] = Object.assign({}, st, t);
                break;
            }
        }
    }

    getTarget(id) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            let t = this._alltargets[i];
            if(id === t.id) {
                return t;
            }
        }
    }

    addTargets(ts = []) {
        for(let i = 0, len = ts.length; i < len; i++) {
            let t = ts[i];
            if(this._checkIdRepeat(t)) {
                console.error('error: id repeat!');
                throw new Error('error: id repeat!');
            } else {
                this.addTarget(t);
            }
        }
    }

    updateAndAddTargets(ts = []) {
        for(let i = 0, len = ts.length; i < len; i++) {
        	let t = ts[i];
        	if (this._isContain(t, this._alltargets)) {
        		this.updateTarget(t);
        	} else {
        		this.addTarget(t);
        	}
        }
    }

    updateAndAddDeleteTargets(ts = []) {
    	this._deleteInvalidTarget(ts);
        for(let i = 0, len = ts.length; i < len; i++) {
        	let t = ts[i];
        	if (this._isContain(t, this._alltargets)) {
        		this.updateTarget(t);
        	} else {
        		this.addTarget(t);
        	}
        }
    }    

    _deleteInvalidTarget(newlist) {
        this._alltargets = this._alltargets.filter(function (value) {
            return this._isContain(value, newlist);
        }.bind(this));
    }

    _isContain(t = {}, ts = []) {
        var iscontain = false;
        for(let i = 0, len = ts.length; i < len; i++) {
            if(ts[i].id === t.id) {
                iscontain = true;
                break;
            }
        }
        return iscontain;
    }

    _checkIdRepeat(id) {
        for(let i = 0, len = this._alltargets.length; i < len; i++) {
            if(id === this._alltargets[i].id) {
                return 1;
            }
        }
        return 0;
    }

}
