class EquipMentLayout {

    constructor(containerClass) {
        this._contanier = $('.' + containerClass);
        this._eqpGraph = new EqpGraph();
    }

    start() {
        this._contanier.css('display', 'block');
        this._eqpGraph.loadData(this._loadDataCallback.bind(this));
    }

    stop() {
        this._contanier.css('display', 'none');
    }

    _loadDataCallback() {

    }
}