var chartArr = [];

$(document).ready(function($) {

    setInterval(function() { updateSnacks() }, 500);

    $('#snack_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/snack.html");
    });

    FusionCharts.ready(function(){

        buildSnackZoom("weight", 384);
        renderSnackGauge("weight_snickers", 0, 100);
//        renderSnackGauge("weight_reeses", 0, 150);
//        renderSnackGauge("weight_almonds", 0, 50);
        renderSnackGauge("weight_almonds", 0, 120);
        renderSnackGauge("weight_reeses", 0, 50);
        renderSnackGauge("weight_granolaBars", 0, 30);
        renderSnackGauge("weight_andes", 0, 300);
        renderSnackGauge("weight_mints", 0, 200);
        renderSnackGauge("weight_starburst", 0, 350);

    })

});


function updateSnacks() {

    $.getJSON('/api/sensor_last/type/weight', function (data) {
        $.each(data, function (index, element) {


            var snack = element.sensor_id.substr(element.sensor_id.indexOf("_") + 1);

            var snack_object = $("#" + snack + "_weight .thermometer-inner-v");
            snack_object.animate({
               height: element.value / 10 + "%"
            }, "slow");

            snack_object = $("#" + snack + "_weightlvl");
            snack_object.text(element.value + " g");

            $.ajax({
                url: '/api/consumption7/' + element.sensor_id,

                success: function(dataset2) {
                    $.each(dataset2, function (index2, element2) {

                        var txtChart = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1) + "_chart3";


                        if (element.value > 0 && element2.rate < 0) {

                            loadNewTextChart(txtChart, Math.ceil((element.value) / (element2.rate * -10)));

                        }
                        else if (element.value < 0){
                            loadNewTextChart(txtChart, element.value);
                            //     alert("Hey, put back those " + element.sensor_id.substring(element.sensor_id.indexOf('_') + 1) + "!")
                        }
                        else {
                            loadNewTextChart(txtChart, 0);

                        }

                    })
                }
            });

        });

    });
}


function buildSnackChart(type, qty) {

    var Categories = {};
    var DataSet = {};

    var validRooms = ['snickers', 'reeses', 'almonds', 'granolaBars', 'andes', 'mints', 'starburst'];

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
            renderSnackChart(Categories, DataSet);
            console.log(Categories);
            console.log(DataSet);
        }
    });
}

function renderSnackChart(Categories, DataSet) {

    var snackChart = new FusionCharts({
        type: 'msline',
        renderAt: 'updating-chart',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "",
                "palette" : "3",
                "anchorRadius": "1",
                "yaxisname": "Grams",
                "xaxisname": "Date:Hour",
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
    snackChart.render();
}

function renderSnackGauge(sensor, lower, upper) {
    var snack = sensor.substring(sensor.indexOf('_') + 1);

    var midLow = Math.floor(upper / 3)
    var midHigh = Math.floor((upper / 3) * 2)

    var snackGauge = new FusionCharts({
        "type": "vled",
        "renderAt": sensor,
        "id": "grams_" + snack,
        "width": "70",
        "height": "90",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "chartTopMargin": "5",
                "captionFontSize": "7",
                "baseFontSize": "12",
                "subcaptionFontBold": "0",
                "showValue" : "1",
                "showTickValues" : "0",
                "lowerLimit": lower,
                "upperLimit": upper,
                "numberSuffix": " ea",
                "showBorder": "0",
                "lowerLimitDisplay": "Empty",
                "upperLimitDisplay": "Full",
                "showShadow": "0",
                "tickMarkDistance": "5",
                "alignCaptionWithCanvas": "1",
                "bgAlpha" : "0,0",
                "dataStreamUrl": "/api/snack_units/" + sensor,
                "refreshInterval": "1"
            },
            "colorRange": {
                "color": [
                    {
                        "minValue": lower,
                        "maxValue": midLow,
                        "code": "#FF0000"
                    },
                    {
                        "minValue": midLow,
                        "maxValue": midHigh,
                        "code": "#FFFF00"
                    },
                    {
                        "minValue": midHigh,
                        "maxValue": upper,
                        "code": "#00FF00"
                    }
                ]
            }
        }

    });

    snackGauge.render();

}

//Flash object when LED value changes!

function FC_ChartUpdated(DOMId) {

        var chartRef = FusionCharts(DOMId);

        var result = $.grep(chartArr, function (e) {
            return e.id === DOMId;
        });

        var existingValue = chartRef.getData();
        if (typeof result[0] != "undefined" && typeof existingValue != "undefined") {
            if (existingValue != result[0]["value"]) {
                console.log('replenish:' + existingValue + ':' + result[0]["value"]);
                console.log('replenish:' + typeof existingValue + ':' + typeof result[0]["value"]);

                //perform function on change in value here
                result[0]["value"] = existingValue;



                $("#" + DOMId + "_panel").removeClass('shake').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass('shake');});

                console.log(DOMId + " value changed: " + result[0]["value"])
            }
        }
        else {

//            if (typeof result[0] != "undefined" && typeof existingValue != "undefined") {
                chartArr.push({"id": DOMId, "value": existingValue })
                console.log("initiated");
//            }

        }

}

function buildSnackZoom(type, qty) {

    var Categories = {};
    var DataSet = {};

    var validSnacks = ['snickers', 'reeses', 'almonds', 'granolaBars', 'andes', 'mints', 'starburst'];

    $.ajax({
        url: '/api/sensor_hour_avg/sensor_type/' + type + '/qty/' + qty,

        success: function(dataset) {
            var arrRows = [];
            var arrCols = [];
            var arrComposite = [];

            $.each(dataset, function (index, element) {

                var dateLabel = element.event_date_hour.substring(4,6) + "/" + element.event_date_hour.substring(6,8)
                    + " " + element.event_date_hour.substring(8);
                var snack = element.sensor_id.substring(element.sensor_id.indexOf('_') + 1);

                if (validSnacks.indexOf(snack) != -1) {

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

                    $.grep(arrRows, function(e){ return e.seriesname === snack; })[0].data.unshift( Math.round(element.hour_avg));

                    //  arrRows.seriesname(element.sensor_id.substring(element.sensor_id.indexOf('_') + 1)).push(Math.round(element.hour_avg))

                }

            });
            Categories = {"category": arrCols.join("|")};

            $.each(arrRows, function(key, value) {

                arrComposite.push({"seriesname": arrRows[key].seriesname, "data": arrRows[key].data.join("|")})
            })

            DataSet = arrComposite;
            renderSnackZoom(Categories, arrComposite);

            //console.log(Categories);
            // console.log(DataSet);
        }
    });
}

function renderSnackZoom(Categories, DataSet) {

    var snackZoom = new FusionCharts({
        type: 'zoomline',
        renderAt: 'updating-chart',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "",
                "yaxisname": "grams",
                "yaxisminValue": "140",
                "yaxismaxValue": "150",
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
    snackZoom.render();
}



