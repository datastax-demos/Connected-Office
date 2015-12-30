$(document).ready(function($) {
//    $('.thermometer').thermometer();
//    $.when(setupHumidityChart())
//        .then(loadTypeChartData(humidityChart, 'humidity', 72));

//    setInterval(function() { updateHumidity() }, 2000);

    $('#humidity_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/humidity.html");
    });

    FusionCharts.ready(function(){

        buildHumidityChart("humidity", 504);
        renderThermometer("humidity_BirdCage");
        renderThermometer("humidity_BoardRoom");
        renderThermometer("humidity_DropZone");
        renderThermometer("humidity_FlightDeck");
        renderThermometer("humidity_Grizzly");
        renderThermometer("humidity_Vortex");
        renderThermometer("humidity_Yeager");

    })

});


function updateHumidity() {

    $.getJSON('/api/sensor_last/type/humidity', function (data) {
        $.each(data, function (index, element) {


            var room = element.sensor_id.substr(element.sensor_id.indexOf("_") + 1);

            var room_object = $("#" + room + "_humidity .thermometer-inner-v");
            room_object.animate({
                height: element.value + "%"
            }, "slow");

            room_object = $("#" + room + "_humiditylvl");
            room_object.text(element.value + "%");

        });

    });

}
function renderThermometer(sensor) {
    var room = sensor.substring(sensor.indexOf('_') + 1);

    var thermometer1 = new FusionCharts({
        "type": "HLinearGauge",
        "renderAt": sensor,
        "id": "humid_" + room,
        "width": "130",
        "height": "60",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "chartTopMargin": "5",
                "captionFontSize": "7",
                "subcaptionFontBold": "0",
                "showValue" : "1",
                "showTickValues" : "0",
                "lowerLimit": "0",
                "upperLimit": "50",
                "numberSuffix": " %",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "thmFillColor": "#3290BF",
                "cylFillColor": "#3290BF",
                "dataStreamUrl": "/api/sensor_last/type/humidity/sensor/" + sensor,
                "refreshInterval": "2"
            },
            "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": "15",
                        "label": "Low",
                        "code": "#1aaf5d"
                    },
                    {
                        "minValue": "15",
                        "maxValue": "30",
                        "label": "Mod",
                        "code": "#f2c500"
                    },
                    {
                        "minValue": "30",
                        "maxValue": "50",
                        "label": "High",
                        "code": "#c02d00"
                    }
                ]
            }
        }
    });

    thermometer1.render();

}

function buildHumidityChart(type, qty) {

    var Categories = {};
    var DataSet = {};

    var validRooms = ['BirdCage', 'BoardRoom', 'DropZone', 'FlightDeck', 'Grizzly', 'Vortex', 'Yeager'];

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            var arrRows = [];
            var arrCols = [];
            var arrComposite = [];

            $.each(dataset, function (index, element) {

                var dateLabel = element.event_date_hour.substring(4,6) + "/" + element.event_date_hour.substring(6,8)
                    + " " + element.event_date_hour.substring(8);
                var room = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1);

                if (validRooms.indexOf(room) != -1) {

                    if (arrRows.some(function (entry, i) {
                        if (entry.seriesname == element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)) return true;
                    }) != true) {

                        arrRows.push({"seriesname": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1), "data" : []})

                    }


                    if (arrCols.indexOf(dateLabel) == -1) {


                        arrCols.unshift(dateLabel)

                    }

                    var pDate = element.event_date_hour;
                    var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                    $.grep(arrRows, function(e){ return e.seriesname === room; })[0].data.unshift( Math.round(element.hour_avg));

                    //  arrRows.seriesname(element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)).push(Math.round(element.hour_avg))

                }

            });
            Categories = {"category": arrCols.join("|")};

            $.each(arrRows, function(key, value) {

                arrComposite.push({"seriesname": arrRows[key].seriesname, "data": arrRows[key].data.join("|")})
            })

            DataSet = arrComposite;
            renderHumidityChart(Categories, arrComposite);

            //console.log(Categories);
            // console.log(DataSet);
        }
    });
}

function renderHumidityChart(Categories, DataSet) {

    var humidityChart = new FusionCharts({
        type: 'zoomline',
        renderAt: 'updating-chart',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "",
                "yaxisname": "%",
                "yaxisminValue": "10",
                "yaxismaxValue": "30",
                "forceAxisLimits" : "1",
                "pixelsPerPoint": "0",
                "pixelsPerLabel": "30",
                "lineThickness": "1",
                "compactdatamode" : "1",
                "dataseparator" : "|",
                "labelHeight": "30",
                "theme": "zune",
                "showValues": "0"
            },
            "categories": [Categories],
            "dataset": DataSet
        }
    });
    humidityChart.render();
}