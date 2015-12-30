$(document).ready(function($) {
//    $('.thermometer').thermometer();
 //   $.when(setupLumensChart())
 //       .then(loadTypeChartData(lumensChart, 'lumens', 72));

//    setInterval(function() { updateLight() }, 2000);

    $('#light_info_btn').click(function (e) {
        e.preventDefault();
        $('#modal_body').load("includes/light.html");
    });
});

FusionCharts.ready(function(){

    buildLightChart("lumens", 504);
    renderThermometer("lumens_BirdCage");
    renderThermometer("lumens_BoardRoom");
    renderThermometer("lumens_DropZone");
    renderThermometer("lumens_FlightDeck");
    renderThermometer("lumens_Grizzly");
    renderThermometer("lumens_Vortex");
    renderThermometer("lumens_Yeager");

})


function updateLight() {

    $.getJSON('/api/sensor_last/type/lumens', function (data) {
        $.each(data, function (index, element) {


            var room = element.sensor_id.substr(element.sensor_id.indexOf("_") + 1);

            var room_object = $("#" + room + "_light .thermometer-inner-v");
            room_object.animate({
                height: element.value + "%"
            }, "slow");

            room_object = $("#" + room + "_lightlvl");
            room_object.text(element.value + "%");

        });

    });

}


function renderThermometer(sensor) {
    var room = sensor.substring(sensor.indexOf('_') + 1);

    var thermometer1 = new FusionCharts({
        "type": "angulargauge",
        "renderAt": sensor,
        "id": "lum_" + room,
        "width": "90",
        "height": "90",
        "dataFormat": "json",
        "dataSource": {
            "chart": {
                "manageresize": "1",
                "origw": "200",
                "origh": "190",
                "bgcolor": "FFFFFF",
                "lowerlimit": "0",
                "upperlimit": "100",
                "majortmnumber": "7",
                "showtickvalues": "0",
                "majortmheight": "8",
                "minortmnumber": "0",
                "showtooltip": "0",
                "majortmthickness": "3",
                "gaugeouterradius": "130",
                "gaugeoriginx": "100",
                "gaugeoriginy": "160",
                "gaugestartangle": "125",
                "gaugeendangle": "55",
                "placevaluesinside": "0",
                "gaugeinnerradius": "115",
                "annrenderdelay": "0",
                "pivotfillmix": "{000000},{FFFFFF}",
                "pivotfillratio": "50,50",
                "showpivotborder": "1",
                "pivotbordercolor": "444444",
                "pivotborderthickness": "2",
                "showshadow": "0",
                "pivotradius": "18",
                "pivotfilltype": "linear",
                "showShadow": "0",
                "showborder": "0",
                "showValue": "1",
                "dataStreamUrl": "/api/sensor_last/type/lumens/sensor/" + sensor,
                "refreshInterval": "2"
            },
            "dials": {
                "dial": [
                    {
                        "borderalpha": "0",
                        "bgcolor": "FF0000",
                        "basewidth": "6",
                        "topwidth": "6",
                        "radius": "120",
                        "value": "0",
                        "valueY": "110"

                    }
                ]
            },
            "trendpoints": {
                "point": [
                    {
                        "startvalue": "0",
                        "displayvalue": "dark",
                        "alpha": "0",
                        "valueInside": "1"
                    },
                    {
                        "startvalue": "100",
                        "displayvalue": "light",
                        "alpha": "0",
                        "valueInside": "1"
                    }
                ]
            },
            "annotations": {
                "groups": [
                    {
                        "x": "100",
                        "y": "160",
                        "items": [
                            {
                                "type": "arc",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "innerradius": "132",
                                "startangle": "53",
                                "endangle": "127",
                                "showborder": "1",
                                "color" : "000000",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            },
                            {
                                "type": "arc",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "innerradius": "132",
                                "startangle": "53",
                                "endangle": "111",
                                "showborder": "1",
                                "color": "999999",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            },
                            {
                                "type": "arc",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "innerradius": "132",
                                "startangle": "53",
                                "endangle": "97",
                                "showborder": "1",
                                "color": "999999",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            },
                            {
                                "type": "arc",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "innerradius": "132",
                                "startangle": "53",
                                "endangle": "83",
                                "showborder": "1",
                                "color": "CCCCCC",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            },
                            {
                                "type": "arc",
                                "x": "0",
                                "y": "0",
                                "radius": "145",
                                "innerradius": "132",
                                "startangle": "53",
                                "endangle": "69",
                                "showborder": "1",
                                "color": "ffffff",
                                "bordercolor": "444444",
                                "borderthickness": "2"
                            }
                        ]
                    }
                ]
            }
        }


    });

    thermometer1.render();

}

function buildLightChart(type, qty) {

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
            renderLightChart(Categories, arrComposite);

            //console.log(Categories);
           // console.log(DataSet);
        }
    });
}

function renderLightChart(Categories, DataSet) {

    var lightChart = new FusionCharts({
        type: 'zoomline',
        renderAt: 'updating-chart',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            "chart": {
                "caption": "",
                "yaxisname": "Lumens",
                "yaxisminValue": "10",
                "yaxismaxValue": "40",
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
    lightChart.render();
}