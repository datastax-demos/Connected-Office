google.load("visualization", "1", {packages:["corechart", "gauge", "geochart", "map", "calendar", "table"]});
var ticker;
var map, mapData, selectMap;
var selectMap, selectMapData, currentTarget;
var envChart, tempChart, humidityChart, pressureChart, lumensChart, motionChart, snackChart;
var almondChart, granolaBarChart, chipChart, cookieChart
var almondChart2, granolaBarChart2, chipChart2, cookieChart2


//
//    BEGIN SUSTAINABILITY CHART SECTION
//

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

function setupTempChart () {

    container = 'updating-chart';
    qty = 168;

    tempChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline'  },
        credits: {enabled: false},
        title: { visible: false, text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}



function setupHumidityChart () {

    container = 'updating-chart';
    qty = 168;

    humidityChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline'  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7'],
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupPressureChart () {

    container = 'updating-chart';
    qty = 168;

    pressureChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline'  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7','#50B432'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupLumensChart () {

    container = 'updating-chart';
    qty = 168;

    lumensChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline'  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupMotionChart () {

    container = 'updating-chart';
    qty = 168;

    motionChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline'  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00'],
        tooltip: {crosshairs: true},
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupSnackChart () {

    container = 'updating-chart';
    qty = 168;

    snackChart = new Highcharts.Chart({
        chart: {
            type: 'area',
            borderWidth: 0, renderTo: container},
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        credits: {enabled: false},
        title: { visible: false, text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Grams', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupAlmondChart () {

    container = 'almond_chart';
    qty = 168;

    almondChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline', width: 0  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 0, gridLineColor: '#BCC6CC'},
        yAxis: {title: { text: '', margin: 20 } },
        colors: ['#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00'],
        legend: { enabled: false, align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        tooltip: {crosshairs: true},
        plotOptions: { spline: { marker: { enabled: false}}},
        series: [] });
}

function setupAlmondChart2 () {

    container = 'almond_chart2';

    almondChart2 = new Highcharts.Chart({

            chart: {
                borderWidth: 0, type: 'solidgauge',
                renderTo: container,
                spacingTop: -50
            },
            title: 'Current Weight',
            credits: {enabled: false},
            pane: {
                center: ['50%', '85%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },

            // the value axis
            yAxis: { stops: [ [0.1, '#DF5353'], // green
                              [0.5, '#DDDF0D'], // yellow
                              [0.9, '#55BF3B'] // red
                               ],
                lineWidth: 0, minorTickInterval: null, tickPixelInterval: 400, tickWidth: 0, labels: { y: 4 },
                  min: 0,
                  max: 1000,
//                    title: { text: 'Current', y: -30}
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 24,
                        borderWidth: 0,
                        useHTML: true,
                        format: '{y} g',
                        style: {fontSize: '100%'}
                    }
                }
            }
        });
}


function setupGranolaBarChart () {

    container = 'granolaBar_chart';
    qty = 168;

    granolaBarChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline', width: 0  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: '', margin: 20 } },
        colors: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B'],
        legend: { enabled: false, align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        plotOptions: { spline: { marker: { enabled: false}}},
        series: [] });
}

function setupGranolaBarChart2 () {

    container = 'granolaBar_chart2';

    granolaBarChart2 = new Highcharts.Chart({

        chart: {
            borderWidth: 0, type: 'solidgauge',
            renderTo: container,
            spacingTop: -50
        },
        credits: {enabled: false},
        title: 'Current Weight',
        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                y: 4
            },

            min: 0,
            max: 1000,
//            title: {
//                text: 'Current',
//                y: -30
//            }


        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 24,
                    borderWidth: 0,
                    useHTML: true,
                    format: '{y} g',
                    style: {fontSize: '100%'}
                }
            }
        }
    });
}

function setupChipChart () {

    container = 'chip_chart';
    qty = 168;

    chipChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline', width: 0  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7'],
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: '', margin: 20 } },
        legend: { enabled: false, align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        plotOptions: { spline: { marker: { enabled: false}}},
        series: [] });
}

function setupChipChart2 () {

    container = 'chip_chart2';

    chipChart2 = new Highcharts.Chart({

        chart: {
            borderWidth: 0, type: 'solidgauge',
            renderTo: container,
            spacingTop: -50
        },
        credits: {enabled: false},
        title: 'Current Weight',
        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                y: 4
            },

            min: 0,
            max: 1000,
//            title: {
//                text: 'Current',
//                y: -30
//            }


        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 24,
                    borderWidth: 0,
                    useHTML: true,
                    format: '{y} g',
                    style: {fontSize: '100%'}
                }
            }
        }
    });
}


function setupCookieChart () {

    container = 'cookie_chart';
    qty = 168;

    cookieChart = new Highcharts.Chart({
        chart: {
            borderWidth: 0, renderTo: container, defaultSeriesType: 'spline', width: 0  },
        credits: {enabled: false},
        title: { text: ''},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000, gridLineWidth: 1, gridLineColor: '#BCC6CC'},
        yAxis: {gridLineColor: '#E5E4E2', gridLineWidth: 1, minPadding: 0.2, maxPadding: 0.2,  title: { text: '', margin: 20 } },
        colors: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7','#50B432'],
        legend: { enabled: false, align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        plotOptions: { spline: { marker: { enabled: false}}},
        series: [] });
}

function setupCookieChart2 () {

    container = 'cookie_chart2';

   cookieChart2 = new Highcharts.Chart({

        chart: {
            borderWidth: 0, type: 'solidgauge',
            renderTo: container,
            spacingTop: -50
        },
       credits: {enabled: false},
        title: 'Current Weight',
        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                y: 4
            },

            min: 0,
            max: 1000,
//            title: {
//                text: 'Current',
//                y: -30
//            }


        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 24,
                    borderWidth: 0,
                    useHTML: true,
                    format: '{y} g',
                    style: {fontSize: '100%'}

                }
            }
        }
    });
}



function loadTextChart (chart, hours) {

    console.log(chart, hours);
    var chartObject = $('#' + chart);
    if (hours == 0) {
        chartObject.html('<h3 class="basket-empty alert animated infinite pulse">Empty</h3>');
    }
    else if (hours <= 8) {
        chartObject.html('<h3 class="alert animated infinite pulse">' + hours + '</h3>');
    }
    else {
        chartObject.html('<h3>' + hours + '</h3>');
    }

    var transLayer = chartObject.parent();

// testing knob
//    hours = 2;

    var opacity = 0.8 - (hours * 0.1);
    if (opacity < 0) {
        opacity = 0;
    }
    transLayer.css('background-color', 'rgba(255,255,255,' + opacity + ')');

    var greyScale = hours * 255/8;
    var re = new RegExp(0, 'g');
    transLayer.parent().css('color', 'rgb(0,0,0)'.replace(re, greyScale));
}

function loadNewTextChart (chart, hours) {

    var mins = $.number(hours * 60);

    var chartObject = $('#' + chart);
    if (hours == 0) {
        if (chartObject.prev().hasClass("hours-header")) {
            chartObject.prev().hide();
        }
        chartObject.text("Empty");
        chartObject.removeClass();
        chartObject.addClass("col-xs-12 text_chart basket-empty alert animated infinite pulse")
    }
    else if (hours <= 8 && hours > 0) {
        if (chartObject.prev().hasClass("hours-header")) {
            chartObject.prev().show();
        }
        chartObject.text(mins);
        chartObject.removeClass();
        chartObject.addClass("col-xs-12 text_chart alert animated infinite pulse");
    }
    else if (hours < 0){
        {
            if (chartObject.prev().hasClass("hours-header")) {
                chartObject.prev().hide();
            }
            chartObject.text("Container Missing");
            chartObject.removeClass();
            chartObject.addClass("col-xs-12 text_chart basket-empty alert animated infinite pulse")
        }
    }
    else {
        if (chartObject.prev().hasClass("hours-header")) {
            chartObject.prev().show();
        }
        chartObject.removeClass();
        chartObject.addClass("col-xs-12 text_chart");
        chartObject.text(mins);
    }

    var transLayer = chartObject.parent().parent().parent();

// testing knob
//    hours = 0;

    var opacity = 0.8 - (hours * 0.1);
    if (opacity < 0) {
        opacity = 0;
    }
    transLayer.css('background-color', 'rgba(255,255,255,' + opacity + ')');
}


function loadTypeChartData(chart, type, qty){

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    chart.addSeries({name: element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        id: element.sensor_id.substr(element.sensor_id), data: [],
                        pointInterval: 3600 * 1000})

                }

                var series = chart.get(element.sensor_id);
                var pDate = element.event_date_hour;
                var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                series.addPoint([ nDate.getTime(), Math.round(element.hour_avg)]);

            })
        }
    });
}

// HACK: Copy of the above function, but restricts to expected validSnacks[]
function loadTypeSnackChartData(chart, type, qty){

    var validSnacks = ['almonds', 'chips', 'cookies', 'granolaBars'];
    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    var snackName = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1);

                    if (validSnacks.indexOf(snackName) == -1) {
                        return;
                    }

                    chart.addSeries({name: element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        id: element.sensor_id.substr(element.sensor_id), data: [],
                        pointInterval: 3600 * 1000})

                }

                var series = chart.get(element.sensor_id);
                var pDate = element.event_date_hour;
                var tDate = pDate.substr(0, 4) + "-" + pDate.substr(4, 2) + "-" + pDate.substr(6, 2) + "T" + pDate.substr(8, 2) + ":00:00.00Z"
                var mDate = moment.utc(tDate)
                var cDate = mDate.clone().tz("America/Los_Angeles")
                series.addPoint([ cDate.valueOf(), Math.round(element.hour_avg)]);

            })
        }
    });
}

function loadSensorChartData(chart, sensor_id, qty){

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_id/' + sensor_id + '/qty/' + qty,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    chart.addSeries({name: element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        id: element.sensor_id.substr(element.sensor_id), data: [],
                        pointInterval: 3600 * 1000})

                }

                var series = chart.get(element.sensor_id);
                var pDate = element.event_date_hour;
                var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                series.addPoint([ nDate.getTime(), element.hour_avg]);

            })
        }
    });
}

function loadSensorChart2Data(chart, sensor_id, qty){

    $.ajax({
        url: '/api/sensor_last/' + sensor_id,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    chart.addSeries({name: element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        id: element.sensor_id.substr(element.sensor_id), data: [0],
                        pointInterval: 3600 * 1000})

                }

                var series = chart.get(element.sensor_id);
                var pDate = element.timestamp;
                var nDate = new Date(pDate);
                //var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                var point = series.points[0];

                point.update([ nDate.getTime(), Math.round(element.value)]);
                //series.addPoint([ nDate.getTime(), Math.round(element.hour_avg)]);

                $.ajax({
                    url: '/api/consumption7/' + sensor_id,

                    success: function(dataset2) {
                        $.each(dataset2, function (index2, element2) {

                            var txtChart = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1) + "_chart3";
                            //alert(element2.rate)

                            if (element.value > 0 && element2.rate < 0) {

                                loadTextChart(txtChart, Math.round((element.value) / (element2.rate * -10)));

                            }
                            else {
                                loadTextChart(txtChart, 0);

                            }

                        })
                    }
                });

                setTimeout( function() {loadSensorChart2Data(chart, sensor_id, qty)}, 3000);
            })
        }
    });
}


//
//    END ENV CHART SECTION
//

//
//    BEGIN SNACK CHART SECTION
//
/*
function setupSnackChart () {
    envChart = new Highcharts.Chart({
        chart: {
            renderTo: 'snack_chart',
            defaultSeriesType: 'line',
            events: {
                load: loadSnackData()
            }
        },
        title: {
            text: 'Snack Inventory'
        },
        xAxis: {
            type: 'datetime',
            minRange: 24 * 3600 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 20
            }
        },
        legend:
        {
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 1,
            borderRadius: 3,
            layout: 'vertical'
        },
        series: [

        ]
    });
}
*/

function loadSnackData(){
    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/weight/qty/600',
        success: function(dataset) {
            $.each(dataset, function(index, element) {

                if (!envChart.get(element.sensor_id.substr(element.sensor_id.indexOf("_") + 1))) {

                    envChart.addSeries({name: element.sensor_id.substr(element.sensor_id.indexOf("_") + 1),
                                        id: element.sensor_id.substr(element.sensor_id.indexOf("_") + 1), data: [],
                                        pointInterval: 3600 * 1000})

                }

                var series = envChart.get(element.sensor_id.substr(element.sensor_id.indexOf("_") + 1));
                var pDate = element.event_date_hour;
                var nDate = new Date(pDate.substr(0,4), pDate.substr(4,2) - 1, pDate.substr(6,2), pDate.substr(8,2), '00', '00', '00')

                series.addPoint([ nDate.getTime(), element.hour_avg]);
            });


        },
        cache: false
    });
}


//
//    END SNACK CHART SECTION
//


//
//    BEGIN GLOBAL MAP SECTION
//


function drawMap() {


        $.getJSON('/api/user_last', function (data) {
            var options = {
                streetViewControl: false,
                center: new google.maps.LatLng(41.850033, -87.6500523),
                center: new google.maps.LatLng(20, 0),
                zoom: 2
            };

            map = new google.maps.Map(document.getElementById("global_map"),
                options);

            $.each(data, function (index, element) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(element.latitude, element.longitude),
                    title: element.user_name,
                    map: map

                    });

                google.maps.event.addListener(marker, 'click', function() {

                    $.when($("#map_modal").modal('show'))
                        .done($('#map_modal').on('shown.bs.modal', function(e) {
                            drawSelectMap(marker.getTitle());
                        }))

                });

            });
        })
}

function updateMap() {

    var dataArray = [];
    dataArray[0] = ['Lat', 'Long', 'user']

    $.getJSON('/api/user_last', function (data) {
        $.each(data, function (index, element) {
            var i = index + 1;
            if (!dataArray[i]) dataArray[i] = new Array(3);

            dataArray[i] = [element.latitude, element.longitude, element.user_name];

        });

        mapData = google.visualization.arrayToDataTable(dataArray);

        var options = {
            showTip: true,
            useMapTypeControl: true

        };
        map.draw(mapData, options);
    });
}

function drawSelectMap(target) {

    if (target) {
        $.getJSON('/api/user_hist/user/' + target + '/qty/48', function (data) {

            var options = {
                streetViewControl: false,
                center: new google.maps.LatLng(41.850033, -87.6500523),
                zoom: 2
            };

            console.log(target)
            selectMap = new google.maps.Map(document.getElementById("track_map"),
                options);


            $.each(data, function (index, element) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(element.latitude, element.longitude),
                    title: element.user_ts,
                    map: selectMap

                });

            });
            $("#head_content").text('USER: ' + target)

        });
    }

}


//
//    END GLOBAL MAP SECTION
//

//
//    BEGIN TICKER SECTION
//

function updateTicker(){

    $.ajax({
        url: '/api/sensor_last/qty/8',
        success: function(dataset) {
            var thisRun = randomIntFromInterval(0,8);
            $.each(dataset, function(index, element) {
                if (index == thisRun) {
                    $("#ticker1").text($("#ticker2").text());
                    $("#ticker2").text($("#ticker3").text());
                    $("#ticker3").text((element.timestamp + " : " + element.sensor + " - " + element.value));
                }
            });
            window.setTimeout(function() { updateTicker(); }, 500);
        },
        cache: false
    });
}

function updateRibbon(){

    //Update message count element
    $.ajax({
        url: 'api/message_count_hour/qty/1',
        success: function(dataset) {
            $.each(dataset, function(index, element) {
            $("#messages_value").html("<i class='fa fa-envelope'></i>&nbsp;" + element.message_count)

            });

        },
        cache: false
    });

    //Update sensor count element
    $.ajax({
        url: 'api/sensorcount',
        success: function(dataset) {
            $.each(dataset, function(index, element) {
                $("#sensors_value").html("<i class='fa fa-envelope'></i>&nbsp;" + element.sensors)

            });

        },
        cache: false
    });
    window.setTimeout(function() { updateRibbon(); }, 1000);

}

//
//    END TICKER SECTION
//

$('#map_modal').on('shown.bs.modal', function (e) {

    drawSelectMap(currentTarget);

})

$(document).ready(function() {
    //setupEnvChart()
    updateTicker();
    updateRibbon();
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
