google.load("visualization", "1", {packages:["corechart", "gauge", "geochart", "map", "calendar", "table"]});
var snackChart;
var ticker;
var map;
var envChart, tempChart, humidityChart, pressureChart, lumensChart, motionChart;
var almondChart, granolaBarChart, chipChart, cookieChart

//
//    BEGIN SUSTAINABILITY CHART SECTION
//

function setupTempChart () {

    container = 'temp_chart';
    qty = 168;

    tempChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Temperature Histogram'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupHumidityChart () {

    container = 'humidity_chart';
    qty = 168;

    humidityChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Humidity Histogram'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7'],
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupPressureChart () {

    container = 'pressure_chart';
    qty = 168;

    pressureChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Pressure Histogram'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7','#50B432'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupLumensChart () {

    container = 'lumens_chart';
    qty = 168;

    lumensChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Light Histogram'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupMotionChart () {

    container = 'motion_chart';
    qty = 168;

    motionChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Motion Histogram'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupAlmondChart () {

    container = 'almond_chart';
    qty = 168;

    almondChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Almonds'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B', '#DDDF00'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupGranolaBarChart () {

    container = 'granolaBar_chart';
    qty = 168;

    granolaBarChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Granola Bars'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7', '#50B432', '#ED561B'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupChipChart () {

    container = 'chip_chart';
    qty = 168;

    chipChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Chips'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7'],
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}

function setupCookieChart () {

    container = 'cookie_chart';
    qty = 168;

    cookieChart = new Highcharts.Chart({
        chart: {
            renderTo: container, defaultSeriesType: 'line'  },
        title: { text: 'Cookies'},
        xAxis: {type: 'datetime', minRange: 24 * 3600 * 1000 },
        yAxis: {minPadding: 0.2, maxPadding: 0.2,  title: { text: 'Value', margin: 20 } },
        colors: ['#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4', '#058DC7','#50B432'],
        legend: { align: 'right', verticalAlign: 'middle', borderWidth: 1, borderRadius: 3, layout: 'vertical' },
        series: [] });
}


function loadTypeChartData(chart, type, qty){

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    chart.addSeries({name: 'sens_' + (index + 1),
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

function loadSensorChartData(chart, sensor_id, qty){

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_id/' + sensor_id + '/qty/' + qty,

        success: function(dataset) {
            $.each(dataset, function (index, element) {

                if (!chart.get(element.sensor_id.substr(element.sensor_id))) {

                    chart.addSeries({name: 'sens_' + (index + 1),
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



//
//    END ENV CHART SECTION
//

//
//    BEGIN SNACK CHART SECTION
//

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

    var dataArray = [];
    dataArray[0] = ['Lat', 'Long', 'Name']

    $.getJSON('/api/user_last', function (data) {
        $.each(data, function (index, element) {
            var i = index + 1;
            if (!dataArray[i]) dataArray[i] = new Array(3);

            dataArray[i] = [element.latitude, element.longitude, element.user];

        });

        var mapData = google.visualization.arrayToDataTable(dataArray);

        var options = {

        };
        map = new google.visualization.GeoChart(document.getElementById('global_map'));

        map.draw(mapData, options);

        setInterval(function() { updateMap() }, 10000)
    });
};

function updateMap() {

    var dataArray = [];
    dataArray[0] = ['Lat', 'Long', 'Name']

    $.getJSON('/api/user_last', function (data) {
        $.each(data, function (index, element) {
            var i = index + 1;
            if (!dataArray[i]) dataArray[i] = new Array(3);

            dataArray[i] = [element.latitude, element.longitude, element.user];

        });

        var mapData = google.visualization.arrayToDataTable(dataArray);

        var options = {

        };
        map.draw(mapData, options);
    });
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

//
//    END TICKER SECTION
//

$(document).ready(function() {
    //setupEnvChart()
    updateTicker();

});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
