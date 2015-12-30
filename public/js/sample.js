
  var serverHost = "http://localhost:3000/api";
  var allSensors;
  var realTime;
  var Snacks;

//FUNCTION FOR allSensors Tab (environment)
  function draw_allSensors() {

      	allSensors = new cfx.Chart();
      	allSensors.setGallery(cfx.Gallery.Lines);
	allSensors.getAnimations().getLoad().setEnabled(true);
//    	allSensors.getDataGrid().setVisible(true);
//      	allSensors.getAxisX().setLabelAngle(90);
	var axisY = allSensors.getAxisY();
	axisY.setMin(0);
	axisY.setMax(850);
	
	var data = allSensors.getData();
	data.setPoints(12);
	data.setSeries(6);

	realTime = allSensors.getRealTime();
	realTime.setBufferSize(12);

	realTime.setMode(cfx.RealTimeMode.Scroll);

      $.getJSON('/api/sensor_last', function(data) {
          $.each(data, function(index, element) {
              allSensors.getSeries().getItem(index).setText(element.sensor);
          });

      });

      var divHolder = document.getElementById('environment_chart');
      allSensors.create(divHolder);
      setInterval(function(){update_allSensors()}, 5000);
  }

function update_allSensors() {
    $.getJSON('/api/sensor_last', function(data) {
        allSensors.getRealTime().beginAddData(1, cfx.RealTimeAction.Append);
        $.each(data, function(index, element) {

            value = element.value;
            if (value < 100) value = value * 10;
            if (value < 100) value = value * 10;
            allSensors.getData().setItem(index,0,value);
        });
        allSensors.getRealTime().endAddData(true,false);
    });
}

  //FUNCTION FOR Snack Tab (environment)
  function draw_Snacks() {

      Snacks = new cfx.Chart();
      Snacks.setGallery(cfx.Gallery.Lines);
      Snacks.getAnimations().getLoad().setEnabled(true);
//    	allSensors.getDataGrid().setVisible(true);
      Snacks.getAxisX().setLabelAngle(90);
      var axisY = Snacks.getAxisY();
      axisY.setMin(0);
      axisY.setMax(850);

      var data = Snacks.getData();
      data.setPoints(12);
      data.setSeries(6);

      realTime = Snacks.getRealTime();
      realTime.setBufferSize(12);

      realTime.setMode(cfx.RealTimeMode.Scroll);

      $.ajax({
          url: (serverHost + "/sensor_last"),
          type: "GET",
          contentType: "application/json",
          dataType : "json",
          async : false,
          success: function (result) {
              Snacks.setDataSource(result);
          },
          error: function (xhr, txt, err) {
              alert("error connecting to data: " + txt);            }
      });

      var divHolder = document.getElementById('snack_chart');
      Snacks.create(divHolder);
  }




  $(document).ready(function($){
      draw_allSensors();
  });



