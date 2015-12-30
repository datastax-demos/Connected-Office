$(document).ready(function($) {

    $('.thermometer').thermometer();

    $.when(setupAlmondChart())
        .then(loadSensorChartData(almondChart, 'weight_almonds', 72));

    $.when(setupAlmondChart2())
        .then(loadSensorChart2Data(almondChart2, 'weight_almonds', 1));

    $.when(setupGranolaBarChart())
        .then(loadSensorChartData(granolaBarChart, 'weight_granolaBars', 72));

    $.when(setupGranolaBarChart2())
        .then(loadSensorChart2Data(granolaBarChart2, 'weight_granolaBars', 1));

    $.when(setupChipChart())
        .then(loadSensorChartData(chipChart, 'weight_chips', 72));

    $.when(setupChipChart2())
        .then(loadSensorChart2Data(chipChart2, 'weight_chips', 1));

    $.when(setupCookieChart())
        .then(loadSensorChartData(cookieChart, 'weight_cookies', 72));

    $.when(setupCookieChart2())
        .then(loadSensorChart2Data(cookieChart2, 'weight_cookies', 1));


});

$('#snack_info_btn').click(function (e) {
    e.preventDefault();
    $('#modal_body').load("includes/snack.html");
});
