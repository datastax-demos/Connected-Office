$(document).ready(function($) {
    var i = 0;
    var location = 0;

    var svg = d3.select("#tracker_chart").append("svg");

    function particle() {
        m = wifiLocations[location];
        location++;
        location %= wifiLocations.length;

        var trackerSchematic = $("#asset-tracking-schematic");
        var width = trackerSchematic.width();
        var height = trackerSchematic.height();

        if (!width || !height) {
            return;
        }

        m0 = m[0] * width / 1000;
        m1 = m[1] * height / 1000;
        m2 = m[2] * width / 1000;

        svg.insert("circle", "rect")
            .attr("cx", m0)
            .attr("cy", m1)
            .attr("r", 1e-6)
            .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
            .style("stroke-opacity", 1)
        .transition()
            .duration(2000)
            .ease(Math.sqrt)
            .attr("r", m2)
            .style("stroke-opacity", 1e-6)
            .remove();
    }

    var wifiLocations = [
        [100, 200, 4],
        [100, 200, 50],
        [100, 200, 100],

        [305, 115, 45],
        [305, 115, 50],
        [305, 115, 55],
        [305, 115, 60],

        [400, 115, 45],
        [400, 115, 50],
        [400, 115, 55],
        [400, 115, 60],

        [500, 115, 20],
        [500, 115, 25],
        [500, 115, 30],
        [500, 115, 35],
        [500, 115, 40],
        [500, 115, 45],
        [500, 115, 50],
        [500, 115, 55],
        [500, 115, 60],

        [600, 115, 45],
        [600, 115, 50],
        [600, 115, 55],
        [600, 115, 60],

        [200, 340, 10],
        [200, 340, 15],
        [200, 340, 20],
        [200, 340, 25],

        [250, 340, 10],
        [250, 340, 15],
        [250, 340, 20],
        [250, 340, 25],

        [285, 340, 10],
        [285, 340, 15],
        [285, 340, 20],
        [285, 340, 25],

        [325, 340, 10],
        [325, 340, 15],
        [325, 340, 20],
        [325, 340, 25],

        [600, 925, 10],
        [600, 925, 15],
        [600, 925, 20],
        [600, 925, 25],
        [600, 925, 30],
        [600, 925, 40],
        [600, 925, 50],
        [600, 925, 55],
        [600, 925, 60],
        [600, 925, 65],

        [50, 685, 10],
        [50, 685, 15],
        [50, 685, 20],
        [50, 685, 25],
        [50, 685, 30],
        [50, 685, 40],
        [50, 685, 50],
        [50, 685, 55],
        [50, 685, 60],
        [50, 685, 65],

        [500, 925, 10],
        [450, 925, 15],
        [300, 925, 20],
        [225, 925, 25],
        [175, 925, 30],
        [175, 925, 40],
        [175, 925, 50],
        [50, 850, 55],
        [50, 850, 60],
        [50, 850, 65],

        [900, 300, 30],
        [900, 300, 50],
        [900, 300, 55],
        [900, 300, 80],

        [975, 600, 80],
        [975, 600, 50],
        [975, 600, 70],
        [975, 600, 60],

        [810, 850, 80],
        [810, 850, 50],
        [810, 850, 70],
        [810, 850, 60],

        [975, 600, 80],
        [975, 600, 50],
        [975, 600, 70],
        [975, 600, 60],
    ];

    function radar(maxWait) {
        for (loop = 0; loop < wifiLocations.length; loop++) {
            setTimeout(function(){ particle(wifiLocations[loop]) }, 1000);
        }
    }
    radar(0);
    setInterval(function() { radar(10000) }, 3000);

    function sms(message) {
        var smsNumber = '+1' + $("#sms-number").val();

        $.post( "/api/message", { number : smsNumber, message : message, key : 'send123' } )
            .done(function( data ) {
              alert( "SMS sent to: " + smsNumber);
            });
        event.preventDefault();
    }

    $(".elevator-text").click(function() {
        sms("Have a great day at work!");
    });

    $(".kitchen-text").click(function() {
        sms("Perhaps now is a great time to have that apple?");
    });

    $(".hr-text").click(function() {
        sms("Just keep that joke to yourself. They won't appreciate it.");
    });

    $(".finance-text").click(function() {
        sms("Money! Money!");
    });

    $('#tracker_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/tracker.html");
    });
});
