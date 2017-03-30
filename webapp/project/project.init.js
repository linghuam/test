
//*****************************加载后执行-start***********************************//
require([
    "jquery",
    "leaflet",
    "bootstrap",
    "core/application"

], function () {
    $(document).ready(function () {       
        L.ICT.App = new L.ICT.Application(Project_ParamConfig);
        L.ict.app = L.ICT.App;
        L.ict.app.init();
        // alert('aaa');

    });

});
//*****************************加载后执行-end***********************************//