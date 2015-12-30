$(document).ready(function($) {
    if (typeof map != 'undefined') {
        //map.clearChart();
        delete window.map;
    }
    drawMap();

    $('#global_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/global.html");
    });

});




