<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Internet of Things!</title>

    <script type="text/javascript" src="scripts/jchartfx/js/jchartfx.system.js"></script>
    <script type="text/javascript" src="scripts/jchartfx/js/jchartfx.coreVector.js"></script>
    <script type="text/javascript" src="scripts/jchartfx/js/jchartfx.animation.js"></script>
    <script type="text/javascript" src="scripts/jchartfx/js/jchartfx.advanced.js"></script>   
    <script src="scripts/jquery-latest.min.js"></script>  
    
<script type="text/javascript">

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
	axisY.setMax(2000);
	
	var data = chart1.getData();
	data.setPoints(20);
	data.setSeries(6);

	var realTime = chart1.getRealTime();
	realTime.setBufferSize(20);
	realTime.setMode(cfx.RealTimeMode.Scroll);
	
	var divHolder = document.getElementById('CHART');
	chart1.create(divHolder);
}


function initial_data(){
    $.getJSON('SensorServlet', function(data) {
    	$.each(data, function(index, element) {
    		chart1.getSeries().getItem(index).setText(element.sensor_id);
    	});
    	       
    }); 	
}


function new_data(){
    $.getJSON('SensorServlet', function(data) {
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


</script>        
</head>
<body onload="loadPage()">
<p><img src="UserServlet"></p>
<p><div id="CHART" style="width:900px;height:300px;display:inline-block"></div></p>
</body>
</html>