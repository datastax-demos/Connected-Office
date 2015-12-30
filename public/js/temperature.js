$(document).ready(function($) {
//    $('.thermometer').thermometer();
//    $.when(setupTempChart())
  //      .then(loadTypeChartData(tempChart, 'temp', 72));

//    setInterval(function() { updateTemps() }, 2000);

    $('#temp_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/temp.html");
    });

    FusionCharts.ready(function(){

        buildTempHeatMap("temp", 504);
        renderThermometer("temp_BirdCage")
        renderThermometer("temp_BoardRoom")
        renderThermometer("temp_DropZone")
        renderThermometer("temp_FlightDeck")
        renderThermometer("temp_Grizzly")
        renderThermometer("temp_Vortex")
        renderThermometer("temp_Yeager")

    })
});


function updateTemps() {

    $.getJSON('/api/sensor_last/type/temp', function (data) {
        $.each(data, function (index, element) {


            var room = element.sensor_id.substr(element.sensor_id.indexOf("_") + 1);

            var room_object = $("#" + room + "_temp .thermometer-inner-v");
            room_object.animate({
               height: element.value + "%"
            }, "slow");

            room_object = $("#" + room + "_reading");
            room_object.text(element.value + " F");

        });

    });

}


function buildTempHeatMap(type, qty) {

    var validRooms = ['BirdCage', 'BoardRoom', 'DropZone', 'FlightDeck', 'Grizzly', 'Vortex', 'Yeager'];
    var chart1Rows = {};
    var chart1Columns = {};
    var chart1Data = {};

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            var arrRows = [];
            var arrCols = [];
            var arrData = [];

            $.each(dataset, function (index, element) {

                var dateLabel = element.event_date_hour.substring(4,6) + "/" + element.event_date_hour.substring(6,8)
                    + " " + element.event_date_hour.substring(8);

                var room = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1);

                if (validRooms.indexOf(room) != -1) {

                    if (arrRows.some(function (entry, i) {
                        if (entry.id == element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)) return true;
                    }) != true) {

                        arrRows.unshift({"id": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)})

                    }

                    if (arrCols.some(function (entry, i) {
                        if (entry.id == element.event_date_hour) return true;
                    }) != true) {

                        arrCols.unshift({"id": element.event_date_hour, "label": element.event_date_hour})

                    }

                    var pDate = element.event_date_hour;
                    var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                    arrData.unshift({"rowid": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        "tooltext" : "$rowLabel {br}Temp :  $dataValue{br} " + dateLabel,
                        "columnid": element.event_date_hour, "value": Math.round(element.hour_avg) });
                }

            });

            while ((arrData.length % 7) != 0) {
                arrData.pop()
            }

            chart1Rows = {"row": arrRows};
            chart1Data = {"data": arrData};
            chart1Columns = {"column" : arrCols};


            renderTempHeatMap(chart1Rows, chart1Data, chart1Columns)
        }
    });
}



function renderTempHeatMap(chart1Rows, chart1Data, chart1Columns) {

    var tempMap = new FusionCharts({
        "type": "heatmap",
        "renderAt": "updating-chart",
        "width": "100%",
        "height": "100%",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "xAxisName": "",
                "yAxisName": "",
                "showplotborder": "0",
                //       "plottooltext": "$rowLabel {br}Temp :  $dataValue{br}$columnLabel",
                "baseFontColor": "#333333",
                "baseFont": "Helvetica Neue,Arial",
                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "showBorder": "0",
                "bgColor": "#ffffff",
                "showShadow": "0",
                "usePlotGradientColor": "0",
                "canvasBgColor": "#ffffff",
                "canvasBorderAlpha": "0",
                "legendBgAlpha": "0",
                "legendBorderAlpha": "0",
                "legendShadow": "1",
                "legendItemFontSize": "10",
                "legendItemFontColor": "#666666",
                "toolTipColor": "#ffffff",
                "toolTipBorderThickness": "0",
                "toolTipBgColor": "#000000",
                "toolTipBgAlpha": "60",
                "toolTipBorderRadius": "2",
                "toolTipPadding": "5",
                "showValues" : false,
                "dateFormat" : "yyyymmddhh",
                "showXAxisLabels" : "0",
                "showYAxisLabels" : "1"
            },
            "rows": chart1Rows,
            "columns": chart1Columns,
            "dataset": [chart1Data],
            "colorrange": {
                "gradient": "1",
                "minvalue": "64",
                "maxvalue": "66",
                "code": "0066CC",
                "startlabel": "Cold",
                "color": [
                    {
                        "code": "FFFFCC",
                        "minvalue": "70",
                        "maxvalue": "70",
                        "label": "Normal"
                    },

                    {
                        "code": "FF3333",
                        "minvalue": "74",
                        "maxvalue": "76",
                        "label": "Hot"
                    }
                ]
            }
        }
    });

    tempMap.render();
}

function renderThermometer(sensor) {
    var room = sensor.substring(sensor.indexOf('_') + 1);

    var thermometer1 = new FusionCharts({
        "type": "thermometer",
        "renderAt": sensor,
        "id": "therm_" + room,
        "width": "60",
        "height": "130",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "chartTopMargin": "5",
                "captionFontSize": "7",
                "subcaptionFontBold": "0",
                "showValue" : "1",
                "showTickValues" : "0",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": "°F",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "thmFillColor": "#008ee4",
                "dataStreamUrl": "/api/sensor_last/type/temp/sensor/" + sensor,
                "refreshInterval": "2"
            }
        }
    });

    thermometer1.render();

}

