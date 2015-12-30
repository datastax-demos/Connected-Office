$(document).ready(function($){

    //Setup default html based verbage for various sections
    $("#sensing_details").load("includes/intro.html");


    $('#mainTabs a[href="#global"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#global"]').on('shown.bs.tab', function (e) {
       if (typeof map != 'undefined') {
           //map.clearChart();
           delete window.map;
       }
       drawMap();
    })

    $('#mainTabs a[href="#environment"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    });

    $('#mainTabs a[href="#temp"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#temp"]').on('shown.bs.tab', function (e) {
        $.when(setupTempChart())
            .then(loadTypeChartData(tempChart, 'temp', 72));
    });

    $('#mainTabs a[href="#humidity"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#humidity"]').on('shown.bs.tab', function (e) {
        $.when(setupHumidityChart())
            .then(loadTypeChartData(humidityChart, 'humidity', 72));
    });

    $('#mainTabs a[href="#pressure"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#pressure"]').on('shown.bs.tab', function (e) {
        $.when(setupPressureChart())
            .then(loadTypeChartData(pressureChart, 'pressure', 72));
    });

    $('#mainTabs a[href="#light"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#light"]').on('shown.bs.tab', function (e) {
        $.when(setupLumensChart())
            .then(loadTypeChartData(lumensChart, 'lumens', 72));
    });

    $('#mainTabs a[href="#motion"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#motion"]').on('shown.bs.tab', function (e) {
        $.when(setupMotionChart())
            .then(loadTypeChartData(motionChart, 'motion', 72));
    });


    $('#mainTabs a[href="#environment"]').on('shown.bs.tab', function (e) {

        $.when(setupTempChart())
            .then(loadTypeChartData(tempChart, 'temp', 72));
    })

    $('#mainTabs a[href="#snacks"]').click(function (e) {
        e.preventDefault()
        $(this).tab('show');
    })

    $('#mainTabs a[href="#snacks"]').on('shown.bs.tab', function (e) {

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

        //  setupSnackChart();
    })



    $('#environment_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/environment.html");
    });





$("#btnTemp")
    .mouseover(function(){
        $(".temp").css("opacity", 100);
        $("#sensing_details").load("includes/temp.html");
    })
    .mouseout(function(){
        $(".temp").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnHumidity")
    .mouseover(function(){
        $(".humidity").css("opacity", 100);
        $("#sensing_details").load("includes/humidity.html");
    })
    .mouseout(function(){
        $(".humidity").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnWeight")
    .mouseover(function(){
        $(".weight").css("opacity", 100);
        $("#sensing_details").load("includes/weight.html");
    })
    .mouseout(function(){
        $(".weight").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnPresence")
    .mouseover(function(){
        $(".presence").css("opacity", 100);
        $("#sensing_details").load("includes/presence.html");
    })
    .mouseout(function(){
        $(".presence").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnMotion")
    .mouseover(function(){
        $(".motion").css("opacity", 100);
        $("#sensing_details").load("includes/motion.html");
    })
    .mouseout(function(){
        $(".motion").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

$("#btnLight")
    .mouseover(function(){
        $(".light").css("opacity", 100);
        $("#sensing_details").load("includes/light.html");
    })
    .mouseout(function(){
        $(".light").css("opacity", 0);
        $("#sensing_details").load("includes/intro.html");
    });

});
