
FusionCharts.ready(function(){

   buildTempHeatMap("temp", 840);
   buildSnackChart("weight", 384);
   renderThermometer();
   renderAlmondBulb();
   renderMessagesGauge();
    renderSnackGauge("weight_almonds")

})

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

                var room = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1);

                if (validRooms.indexOf(room) != -1) {

                    if (arrRows.some(function (entry, i) {
                        if (entry.id == element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)) return true;
                    }) != true) {

                        arrRows.push({"id": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)})

                    }

                    if (arrCols.some(function (entry, i) {
                        if (entry.id == element.event_date_hour) return true;
                    }) != true) {

                        arrCols.push({"id": element.event_date_hour, "label": element.event_date_hour})

                    }

                    var pDate = element.event_date_hour;
                    var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                    arrData.push({"rowid": element.sensor_id.substring(element.sensor_id.indexOf('_') + 1),
                        "tooltext" : "$rowLabel {br}Temp :  $dataValue{br} " + element.event_date_hour,
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

    var revenueChart = new FusionCharts({
        "type": "heatmap",
        "renderAt": "chart1",
        "width": "800",
        "height": "350",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "Conference Room Temperature Variation",
                "xAxisName": "",
                "yAxisName": "",
                "showplotborder": "1",
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
                "legendItemFontSize": "12",
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
                "minvalue": "62",
                "code": "0066CC",
                "startlabel": "Cool",
                "color": [

                    {
                        "code": "6DA81E",
                        "minvalue": "70",
                        "maxvalue": "70",
                        "label": "Normal"
                    },
                    {
                        "code": "B80000",
                        "minvalue": "71",
                        "maxvalue": "78",
                        "label": "Warm"
                    }
                ]
            }
        }
    });

    revenueChart.render();
}

function buildSnackChart(type, qty) {

    var Categories = {};
    var DataSet = {};

    var validRooms = ['almonds', 'granolaBars', 'cookies', 'chips'];

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


                    if (arrCols.some(function (entry, i) {
                            if (entry.label == dateLabel) return true;
                        }) != true) {

                        arrCols.unshift({"label" : dateLabel})

                    }

                    var pDate = element.event_date_hour;
                    var nDate = new Date(pDate.substr(0, 4), pDate.substr(4, 2) - 1, pDate.substr(6, 2), pDate.substr(8, 2), '00', '00', '00')

                    $.grep(arrRows, function(e){ return e.seriesname === room; })[0].data.unshift({"value" : Math.round(element.hour_avg)});

                  //  arrRows.seriesname(element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)).push(Math.round(element.hour_avg))

                }

            });
            Categories = {"category": arrCols};

            $.each(arrRows, function(key, value) {

                arrComposite.push({"seriesname": arrRows[key].seriesname, "data": arrRows[key].data.join("|")})
            })

            DataSet = [arrRows];
            renderTempChart(Categories, DataSet);
            console.log(Categories);
            console.log(DataSet);
        }
    });
}

function renderTempChart(Categories, DataSet) {

    var pressureChart = new FusionCharts({
        type: 'stackedarea2d',
        renderAt: 'chart2',
        width: '800',
        height: '350',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "",
                "yaxisname": "Temperature",
                "xaxisname": "Date:Hour",
                "yaxisminValue": "0",
                "yaxismaxValue": "4000",
                "forceAxisLimits" : "1",
                "pixelsPerPoint": "0",
                "pixelsPerLabel": "30",
                "lineThickness": "1",
                "compactdatamode" : "1",
                "dataseparator" : "|",
                "labelHeight": "30",
                "theme": "fint",
                "showValues": "0"
            },
            "categories": [Categories],
            "dataset": [DataSet]
        }
    });
    pressureChart.render();
}

function renderThermometer() {
    var thermometer1 = new FusionCharts({
        "type": "thermometer",
        "renderAt": "gauge1",
        "id": "temp-monitor",
        "width": "40",
        "height": "90",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "",
                "captionFontSize": "7",
                "subcaptionFontBold": "0",
                "showValue" : "0",
                "showTickValues" : "0",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": "°F",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "thmFillColor": "#008ee4",
                "dataStreamUrl": "/api/sensor_last/type/temp/sensor/temp_BirdCage",
                "refreshInterval": "2"
            }
        }
    });

    thermometer1.render();

}

function renderAlmondBulb() {


        var almondBulb = new FusionCharts({

            "type": "cylinder",
            "renderAt": "gauge2",
            "id": "myChart",
            "width": "200",
            "height": "200",
            "dataFormat": "json",
            "dataSource": {
                "chart": {
                    "caption": "Almond Inventory",
                    "upperlimit": "1000",
                    "lowerlimit": "-10",
                    "subcaptionFontBold": "0",
                    "lowerLimitDisplay": "Empty",
                    "upperLimitDisplay": "Full",
                    "numberSuffix": " g",
                    "showValue": "0",
                    "showhovereffect": "1",
                    "bgCOlor": "#ffffff",
                    "borderAlpha": "0",
                    "cylFillColor": "#008ee4",
                    "dataStreamUrl": "/api/sensor_last/type/weight/sensor/weight_almonds",
                    "refreshInterval": "2"
                },

                "value": "15"
            },
            "events": {}
        })
    almondBulb.render();

}

function renderMessagesGauge() {
    var messagesGauge = new FusionCharts({
        "type": "angulargauge",
        "renderAt": "gauge3",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "caption": "Almond Inventory",
                "manageresize": "1",
                "origw": "400",
                "origh": "250",
                "managevalueoverlapping": "1",
                "autoaligntickvalues": "1",
                "bgcolor": "AEC0CA,FFFFFF",
                "fillangle": "45",
                "upperlimit": "1000",
                "lowerlimit": "0",
                "majortmnumber": "10",
                "majortmheight": "8",
                "showgaugeborder": "0",
                "gaugeouterradius": "140",
                "gaugeoriginx": "205",
                "gaugeoriginy": "206",
                "gaugeinnerradius": "2",
                "formatnumberscale": "1",
                "numberprefix": "",
                "decmials": "2",
                "tickmarkdecimals": "1",
                "pivotradius": "17",
                "showpivotborder": "1",
                "pivotbordercolor": "000000",
                "pivotborderthickness": "5",
                "pivotfillmix": "FFFFFF,000000",
                "tickvaluedistance": "10",
                "showborder": "0",
                "dataStreamUrl": "/api/sensor_last/type/weight/sensor/weight_almonds",
                "refreshInterval": "2"
            },
            "colorrange": {
                "color": [
                    {
                        "minvalue": "0",
                        "maxvalue": "200",
                        "code": "B41527"
                    },
                    {
                        "minvalue": "200",
                        "maxvalue": "500",
                        "code": "E48739"
                    },
                    {
                        "minvalue": "500",
                        "maxvalue": "1000",
                        "code": "399E38"
                    }
                ]
            },
            "dials": {
                "dial": [
                    {

                        "borderalpha": "0",
                        "bgcolor": "000000",
                        "basewidth": "28",
                        "topwidth": "1",
                        "radius": "130"
                    }
                ]
            },
            "annotations": {
                "groups": [
                    {
                        "x": "205",
                        "y": "207.5",
                        "items": [
                            {
                                "type": "circle",
                                "x": "0",
                                "y": "2.5",
                                "radius": "150",
                                "startangle": "0",
                                "endangle": "180",
                                "fillpattern": "linear",
                                "fillasgradient": "1",
                                "fillcolor": "dddddd,666666",
                                "fillalpha": "100,100",
                                "fillratio": "50,50",
                                "fillangle": "0",
                                "showborder": "1",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            },
                            {
                                "type": "circle",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "startangle": "0",
                                "endangle": "180",
                                "fillpattern": "linear",
                                "fillasgradient": "1",
                                "fillcolor": "666666,ffffff",
                                "fillalpha": "100,100",
                                "fillratio": "50,50",
                                "fillangle": "0"
                            }
                        ]
                    }
                ]
            }
        }
    });
    messagesGauge.render();

}

function renderSnackGauge(sensor) {
    var snack = sensor.substring(sensor.indexOf('_') + 1);

    var snackGauge = new FusionCharts({
        "type": "vled",
        "renderAt": sensor,
        "id": "therm_" + snack,
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
                "upperLimit": "1000",
                "numberSuffix": " g",
                "bgColor": "#ffffff",
                "showBorder": "0",
                "thmFillColor": "#008ee4",
                "lowerLimitDisplay": "Empty",
                "upperLimitDisplay": "Full",
                "dataStreamUrl": "/api/sensor_last/type/weight/sensor/" + sensor,
                "refreshInterval": "2"
            },
            "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": "150",
                        "code": "#8e0000"
                    },
                    {
                        "minValue": "150",
                        "maxValue": "400",
                        "code": "#f2c500"
                    },
                    {
                        "minValue": "400",
                        "maxValue": "1000",
                        "code": "#1aaf5d"
                    }
                ]
            },
            "value": "92"
        }

    });

    snackGauge.render();

}

