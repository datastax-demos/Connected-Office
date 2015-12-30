var chart1;
var value;

function loadPage(){
    initial_data();
    loadChart();
    //new_data();
}


function loadChart(){
    chart1 = new cfx.Chart();
    chart1.getAnimations().getLoad().setEnabled(true);
    chart1.setGallery(cfx.Gallery.Lines);

    var axisY = chart1.getAxisY();
    axisY.setMin(0);
    axisY.setMax(850);

    var data = chart1.getData();
    data.setPoints(20);
    data.setSeries(6);

    var realTime = chart1.getRealTime();
    realTime.setBufferSize(20);
    realTime.setMode(cfx.RealTimeMode.Scroll);

    var divHolder = document.getElementById('chart1');
    chart1.create(divHolder);
}


function initial_data(){
    $.getJSON('/api/sensor_last', function(data) {
        $.each(data, function(index, element) {
            chart1.getSeries().getItem(index).setText(element.sensor_id);
        });

    });
}


function new_data(){
    $.getJSON('/api/sensor_last', function(data) {
        chart1.getRealTime().beginAddData(1, cfx.RealTimeAction.Append);
        $.each(data, function(index, element) {
            value = element.value;
            if (value < 100) value = value * 10;
            if (value < 100) value = value * 10;
            chart1.getData().setItem(index,0,value);
        });
        chart1.getRealTime().endAddData(false,false);
    });
}


setInterval(function(){new_data()}, 2000);
