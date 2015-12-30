  google.load("visualization", "1", {packages:["corechart", "gauge", "map", "calendar", "table"]});
  google.setOnLoadCallback(drawRoomChart);
  google.setOnLoadCallback(drawLunchChart);
  google.setOnLoadCallback(drawSnackChart);
  google.setOnLoadCallback(drawGauges);
  google.setOnLoadCallback(drawMap);

  var serverHost = "http://localhost:3000";

  // Draw gauges for top bar
  //Currently a separate call for each gauge until I figure out
  //how to set options for each display in a gauge set
  function drawGauges() {

      //get and draw Messages Gauge
     $.ajax({
          url: serverHost + "/api/count/type/all",
          dataType:"jsonp"
      })
         .done(function( data ) {

             var optionsMessages = {
                 width: 130, height: 120,
                 max: 5000, min: 0,
                 redFrom: 4500, redTo: 5000,
                 yellowFrom:4000, yellowTo: 4500,
                 minorTicks: 3
             };

             var dataMessages = new google.visualization.DataTable(data);

             var chart2 = new google.visualization.Gauge(document.getElementById('messages'));
             chart2.draw(dataMessages, optionsMessages);


         });

      var dataSensors = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Sensors', Math.floor(Math.random() * (130 - 125 + 1)) + 125]
      ]);

      var dataMessages = new google.visualization.DataTable(data);

      var dataOccupancy = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Occupancy', 84]
      ]);

      var optionsSensors = {
          width: 130, height: 120,
          max: 250,  min: 0,
          redFrom: 225, redTo: 250,
          yellowFrom:210, yellowTo: 225,
          minorTicks: 5
      };

      var optionsOccupancy = {
          width: 130, height: 120,
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
      };

      var chart1 = new google.visualization.Gauge(document.getElementById('sensors'));
      chart1.draw(dataSensors, optionsSensors);

      var chart3 = new google.visualization.Gauge(document.getElementById('occupancy'));
      chart3.draw(dataOccupancy, optionsOccupancy);

  }
  
  function drawRoomChart() {
    var roomdata = google.visualization.arrayToDataTable([
      ['Day', 'BirdCage', 'Boardroom', 'Cassandra', 'FlightDeck', 'Grizzly', 'Vortex', 'Yeager'],
	  ['M',	60,	25,	15,	15,	5,	12,	22],
	  ['T',	85,	60,	25,	22,	18,	34,	39],
	  ['W',	95,	60,	25,	32,	30,	59,	56],
	  ['T',	95,	65,	20,	18,	18,	11,	17],
	  ['F',	60,	50,	25,	27,	12,	8,	5]
	  
    ]);

    var options = {
      title: 'Conference Room Utilization (M-F / 8-6 - 15 minute blocks)',
      hAxis: {title: '2014/05/26 - 2014/05/30', titleTextStyle: {color: 'black'}}
    };


    var roomchart = new google.visualization.ColumnChart(document.getElementById('room_chart'));
    roomchart.draw(roomdata, options);


    google.visualization.events.addListener(roomchart, 'select', function() {
        //alert();
        //drawCalendarChart();
        var selection = roomchart.getSelection();

        if (selection[0] != null) {
            $('#modal_content').empty();
            drawDetailRoomChart(roomdata.getColumnLabel(roomchart.getSelection()[0].column));
            $('#chart_title').text("Detailed Room Utilization - " + roomdata.getColumnLabel(roomchart.getSelection()[0].column));
            $('#chart_modal').modal({
                keyboard: false
            });

        }

    })

      google.visualization.events.addListener(roomchart, 'onmouseover', function(e) {
          //alert();
          //drawCalendarChart();
          if (e != null) {
              var fieldName = '#' + roomdata.getColumnLabel(e.column).toLowerCase();
              $(fieldName).toggleClass("room_occupancy_label_hover", true)
          }

      })

      google.visualization.events.addListener(roomchart, 'onmouseout', function(e) {
          //alert();
          //drawCalendarChart();
          var selection = roomchart.getSelection();

          if (e != null) {
              var fieldName = '#' + roomdata.getColumnLabel(e.column).toLowerCase();
              $(fieldName).toggleClass("room_occupancy_label_hover", false);
          }

      })

  }
 
  //Draw Snack consumption chart
  function drawSnackChart_old() {
    var data = google.visualization.arrayToDataTable([
      ['Snack', 'Withdrawals', 'Additions', 'Inventory'],
	  ['Apples',	55,	25,	15],
	  ['Granola Bars',	85,	60,	25],
	  ['Almonds',	90,	60,	25],
	  ['Peanuts',	90,	65,	20],
	  ['Peanuts',	90,	65,	20],
	  ['Jerky',	90,	65,	20],
	  ['Cookies',	90,	65,	20],
	  ['Oreos',	35,	50,	25]
	  
    ]);

    var options = {
      title: 'Snack Utilization',
      hAxis: {title: '2014/05/26-2014/05/30', titleTextStyle: {color: 'black'}}
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('snack_chart'));
    chart.draw(data, options);
  }
  
  //Draw lunch room utilization chart
  function drawLunchChart() {
    var data = google.visualization.arrayToDataTable([
      ['Day', 'Average Attendance', 'Peak Attendance', 'Portions Ordered', 'Portions Wasted', 'Projected Order'],
      ['M',  24, 30, 50, 12, 0],
      ['T',  28, 34, 50, 8, 0],
      ['W',  30, 38, 50, 2, 0],
      ['T',  22, 26, 50, 6, 0],
	  ['F',  18, 20, 50, 14, 0],
      ['M',  24, 30, 0, 0, 40],
      ['T',  28, 34, 0, 0, 42],
      ['W',  30, 38, 0, 0, 48],
      ['T',  22, 26, 0, 0, 43],
	  ['F',  18, 20, 0, 0, 38]
    ]);

    var options = {
      title: 'Lunch Room Attendance / Lunch Orders (w/ forecast)',
      hAxis: {title: 'Current Week - Forecast',  titleTextStyle: {color: '#333'}},
	  vAxis: {title: "People/Orders", minValue: 0, titleTextStyle: {color: '#333'}},
	  series:{0:{type: "line"}, 1:{type: "line"}, 2:{type: "bars"}, 3:{type: "bars"}, 4:{type: "bars"}}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('lunch_chart'));
    chart.draw(data, options);
  }

  function drawSnackChart() {
      var data = google.visualization.arrayToDataTable([
          ['ID', 'Inventoy', 'Restocked', 'Snack', 'Consumed'],
          ['',    75, 25,      'Peanuts',  50],
          ['',    22, 25,      'Almonds',         38],
          ['',    36, 25,      'Granola Bars',         74],
          ['',    60, 60,      'Oreos',    75],
          ['',    30, 2,         'Choc. Chip', 40],
          ['',    65, 45,       'Apples',   4],
          ['',    8, 0,      'Bananas',    8],
          ['',    18, 10,      'Jerky',    35],
          ['',    27, 5,      'Cheese Crackers',         24],
          ['',    33, 5,      'M & Ms',  67]
      ]);

      var options = {
          title: 'Snack Utilization & Restock / Current Inventory (unit weight)',
          hAxis: {title: 'Inventory'},
          vAxis: {title: 'Restocked'},
          bubble: {textStyle: {fontSize: 11}}
      };

      var chart = new google.visualization.BubbleChart(document.getElementById('snack_chart'));
      chart.draw(data, options);
  }

  function drawPieChart() {
      var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7]
      ]);

      var options = {
          title: 'My Daily Activities',
          is3D: true,
          width: 800,
          height: 450
      };

      var chart = new google.visualization.PieChart(document.getElementById('modal_content'));
      chart.draw(data, options);
  }

  function setOfficePlanValues() {

      var newValue = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
      var currRoom = Math.floor(Math.random() * (6 - 0 + 1)) + 0;

      var rooms = ['#boardroom', '#birdcage', '#flightdeck', '#grizzly', '#cassandra', '#vortex', '#yeager' ]

      $(rooms[currRoom]).text(newValue.toString());

  }

  function drawCalChart() {
      var caldataTable = new google.visualization.DataTable();
      caldataTable.addColumn({ type: 'date', id: 'Date' });
      caldataTable.addColumn({ type: 'number', id: 'Won/Loss' });
      caldataTable.addRows([
          [ new Date(2012, 3, 13), 37032 ],
          [ new Date(2012, 3, 14), 38024 ],
          [ new Date(2012, 3, 15), 38024 ],
          [ new Date(2012, 3, 16), 38108 ],
          [ new Date(2012, 3, 17), 38229 ],
          // Many rows omitted for brevity.
          [ new Date(2013, 9, 4), 38177 ],
          [ new Date(2013, 9, 5), 38705 ],
          [ new Date(2013, 9, 12), 38210 ],
          [ new Date(2013, 9, 13), 38029 ],
          [ new Date(2013, 9, 19), 38823 ],
          [ new Date(2013, 9, 23), 38345 ],
          [ new Date(2013, 9, 24), 38436 ],
          [ new Date(2013, 9, 30), 38447 ]
      ]);

      var calchart = new google.visualization.Calendar(document.getElementById('modal_content'));

      var caloptions = {
          title: "Red Sox Attendance",
          height: 350,
          width: 880,
          calendar: { cellSize: 10 }
      };

     calchart.draw(caldataTable, caloptions);
  }


  function drawMap() {
      var mapData = google.visualization.arrayToDataTable([
          ['Lat', 'Long', 'Name'],
          [37.3872135, -121.9739083, 'Solutions Engineer'],
          [37.4289, -122.1697, 'Evangelist'],
          [37.6153, -122.3900, 'Solutions Architect'],
          [51.5081779,-0.4440233, 'Support Engineer'],
          [28.378506,-81.5258875, 'Enterprise Sales'],
          [27.175015,78.042155, 'Enterprise Sales'],
          [40.74844,-73.985664, 'Software Engineer']

      ]);

      var options = {
          showTip: true,
          zoomLevel: 0,
          width: 1000
      };

      var map = new google.visualization.Map(document.getElementById('people_map'));

      map.draw(mapData, options);
  };

  function drawDetailRoomChart(room) {

      var now = new Date(Date.now());
      var ceiling, floor;

      switch (room) {
          case "BirdCage":
              ceiling = 100;
              floor = 75;
              break;
          case "Boardroom":
              ceiling = 60;
              floor = 30;
              break;
          case "Cassandra":
              ceiling = 40;
              floor = 10;
              break;
          case "FlightDeck":
              ceiling = 50;
              floor = 0;
              break;
          case "Grizzly":
              ceiling = 40;
              floor = 5;
              break;
          case "Vortex":
              ceiling = 25;
              floor = 0;
              break;
          case "Yeager":
              ceiling = 20;
              floor = 0;
              break;
      }


      var dataCal = new google.visualization.DataTable();
      dataCal.addColumn({ type: 'date', id: 'Date' });
      dataCal.addColumn({ type: 'number', id: 'Occupancy' });
      for (var d = new Date(2014, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
          if (d.getDay() > 0 && d.getDay() < 6){
              dataCal.addRow([new Date(d), Math.floor(Math.random() * (ceiling - floor + 1)) + floor]);
          }
      }

      var calchart = new google.visualization.Calendar(document.getElementById('modal_content'));

      var options = {
          height: 350,
          width: 900,
          calendar: { cellSize: 15 },
          forceIFrame: true
      };

      calchart.draw(dataCal, options);
  }

  setInterval(drawGauges, 5000);
  setInterval(setOfficePlanValues, 3000)
