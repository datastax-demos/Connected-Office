$(document).ready(function($) {

    $('#motion_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/motion.html");
    });

});

FusionCharts.ready(function(){

    buildMotionMap("motion", 504);
    renderThermometer("motion_BirdCage");
    renderThermometer("motion_BoardRoom");
    renderThermometer("motion_DropZone");
    renderThermometer("motion_FlightDeck");
    renderThermometer("motion_Grizzly");
    renderThermometer("motion_Vortex");
    renderThermometer("motion_Yeager");

})

function updateMotion() {

    $.getJSON('/api/sensor_last/type/motion', function (data) {
        $.each(data, function (index, element) {


            var room = element.sensor_id.substr(element.sensor_id.indexOf("_") + 1);

            var room_object = $("#" + room + "_motion .thermometer-inner-v");
            room_object.animate({
                height: element.value * 100 + "%"
            }, "slow");

            room_object = $("#" + room + "_motionlvl");
            room_object.text(element.value);

        });

    });

}

function buildMotionMap(type, qty) {

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

                        arrCols.unshift({"id": element.event_date_hour, "label": dateLabel})

                    }

                    var pDate = element.event_date_hour;
                    var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                    arrData.unshift({"rowid": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        "tooltext" : "$rowLabel {br}Occupied : " + !!Math.round(element.hour_avg) + "{br} " + dateLabel,
                        "columnid": element.event_date_hour, "value": Math.round(element.hour_avg) });
                }

            });

            while ((arrData.length % 7) != 0) {
                arrData.pop()
            }

            chart1Rows = {"row": arrRows};
            chart1Data = {"data": arrData};
            chart1Columns = {"column" : arrCols};


            renderMotionMap(chart1Rows, chart1Data, chart1Columns)
        }
    });
}



function renderMotionMap(chart1Rows, chart1Data, chart1Columns) {

    var motionMap = new FusionCharts({
        "type": "heatmap",
        "renderAt": "updating-chart",
        "width": "100%",
        "height": "100%",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "",
                "xAxisName": "",
                "yAxisName": "",
                "showplotborder": "0",
                //       "plottooltext": "$rowLabel {br}Occupied :  $dataValue{br}$columnLabel",
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
                "showXAxisLabels" : "1",
                "showYAxisLabels" : "1"
            },
            "rows": chart1Rows,
            "columns": chart1Columns,
            "dataset": [chart1Data],
            "colorrange": {
                "gradient": "0",
                "minvalue": "0",
                "code": "009900",
                "startlabel": "Vacant",
                "endlabel": "Occupied",
                "color": [
                    {
                        "code": "009900",
                        "minvalue": "0",
                        "maxvalue": ".9",
                        "label": "Vacant"
                    },
                    {
                        "code": "990000",
                        "minvalue": "1",
                        "maxvalue": "1.9",
                        "label": "Occupied"
                    }
                ]
            }
        }
    });

    motionMap.render();
}

function renderThermometer(sensor) {
    var room = sensor.substring(sensor.indexOf('_') + 1);

    var thermometer1 = new FusionCharts({
        "type": "bulb",
        "renderAt": sensor,
        "id": "mot_" + room,
        "width": "90",
        "height": "90",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "chartTopMargin": "5",
                "captionFontSize": "7",
                "subcaptionFontBold": "0",
                "showvalue": "1",
                "useColorNameAsValue": "1",
                "placeValuesInside": "1",
                "valueFontSize": "12",
                "baseFontColor": "#FFFFFF",
                "baseFont": "Helvetica Neue,Arial",
                "showTickValues" : "0",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": "",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "thmFillColor": "#008ee4",
                "dataStreamUrl": "/api/sensor_last/type/motion/sensor/" + sensor,
                "refreshInterval": "2"
            },
            "colorrange": {
                "color": [
                    {
                        "minvalue": "0",
                        "maxvalue": ".9",
                        "label": "Vacant",
                        "code": "#009900"
                    },
                    {
                        "minvalue": "1",
                        "maxvalue": "2",
                        "label": "Occupied",
                        "code": "#990000"
                    }
                ]
            }
        }
    });

    thermometer1.render();

}