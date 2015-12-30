$(document).ready(function($) {
    var last_timestamp;

    // decay every 0.1 by decreasing the population by 1
    function decay() {
        for (newColorLoop = 0; newColorLoop < 21; newColorLoop++) {
            thisCircle = $('#circle_' + newColorLoop);

            population = parseInt(thisCircle.attr('population'));
            population = population - 10;
            if (population < 0) {
                population = 0;
            }

            thisCircle.css('background', 'rgba(0, ' + (population) + ', ' + (255 - population) + ', 1)');
            thisCircle.attr('population', population);
        }
    }

    // add some devices into a range and update the rgb color
    function newColor(devices, range) {
        thisCircle = $('#circle_' + range);

        population = parseInt(thisCircle.attr('population'));
        population = population + devices * 100;
        if (population > 255) {
            population = 255;
        }

        thisCircle.css('background', 'rgba(0, ' + (population) + ', ' + (255 - population) + ', 1)');
        thisCircle.attr('population', population);
    }

    function radar() {
        // radar graphic
        $.ajax({
            url: "/api/net_devices",
            cache: false
        }).done(function(resp) {
            decay();
            var log;
            var deviceCount = 0;
            for (loop = 0; loop < resp.length; loop++) {
                log = resp[loop];

                if (last_timestamp && log.timestamp < last_timestamp) {
                    last_timestamp = resp[0].timestamp;
                    return;
                }

                if (log.timestamp == resp[0].timestamp) {
                    // wait to process these requests until next time
                    continue;
                }

                deviceCount += parseInt(log.devices);
                newColor(parseInt(log.devices), log.range * -1);
                // console.log(log.devices);
                // console.log(log.range);
                // console.log('------------');
            }
//            console.log(resp);
            last_timestamp = resp[0].timestamp;
        });

        // device count
        $.ajax({
            url: "/api/net_device_count",
            cache: false
        }).done(function(resp) {
//            console.log('joaquin:' + resp);
//            $('#count h2').html(resp.device_count);
            $('#count h2').html(resp);
        });
    }

    // start once and loop every 0.1 seconds
    radar();
    setInterval(function() { radar() }, 1000);

    // info button
    $('#tracker_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/tracker.html");
    });

    // create inner circles
    var thisCircle = $('#circles');
    for (loop = 20; loop >= 0; loop--) {
        thisCircle.html('<div id="circle_' + loop + '" class="circle"></div>');
        thisCircle = $('#circle_' + loop);
    }

    // format circle css
    var circleIncrements = 8;
    for (loop = 0; loop < 21; loop++) {
        $('#circle_' + loop).css('width', loop * circleIncrements + 'px');
        $('#circle_' + loop).css('height', loop * circleIncrements + 'px');
        $('#circle_' + loop).css('top',  circleIncrements / 2 + 'px');
        $('#circle_' + loop).attr('population', 0);
        $('#circle_' + loop).css('background', 'rgba(0, 0, 255, 1)');

        if (loop != 20)
            $('#circle_' + loop).css('left', circleIncrements / 2 + 'px');
    }

});
