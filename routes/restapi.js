var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var uuid = require('node-uuid');
var _ = require('underscore');
var whitelist = [];
var whitelist_stamp;

//var snack_weights = {"almonds": 44, "mints": 4, "granolaBars": 33, "warHeads": 4, "clementines": 50, "pretzels": 25, "mnms": 15 };
//var snack_weights = {"snickers": 16, "reeses": 8, "almonds": 44, "granolaBars": 34, "andes": 4, "mints": 4, "starburst": 5 };
var snack_weights = {"snickers": 16, "reeses": 44, "almonds": 8, "granolaBars": 34, "andes": 4, "mints": 4, "starburst": 5 };

//Controls for offer delivery
var rssiLimit = -60;
var offerTimeTable = "sms_5m";   //sms_1m or sms_5m sms_15m

var cql = require('node-cassandra-cql');
if (process.env.CASSANDRA_HOST) {
    console.log('Using Cassandra Host: ' + process.env.CASSANDRA_HOST);
    var client = new cql.Client({hosts: [process.env.CASSANDRA_HOST], keyspace: 'coffice', poolSize: 4, getAConnectionTimeout: 1000, maxExecuteRetries: 5});
} else {
//    var hosts = ['10.106.69.9', '10.106.69.8', '10.106.69.7', '10.106.69.6', '10.106.69.5'];
    var hosts = 'localhost'.split(',');
    console.log('Using Cassandra Hosts: ' + hosts);
    var client = new cql.Client({hosts: hosts, keyspace: 'coffice', poolSize: 4, getAConnectionTimeout: 1000, maxExecuteRetries: 5});
}
var consistency = cql.types.consistencies.one;


/* GET users listing. */
router.get('/', function(req, res) {

	res.send('respond with a resource');
});

//Params Handling
router.param('name', function(req, res, next, name) {
	// validation step
	req.name = name;
	next();
});

router.param('sensor_id', function(req, res, next, sensor_id) {
	// validation step
	req.sensor_id = sensor_id;
	next();
});

router.param('day', function(req, res, next, day) {
	// validation step
	req.day = day;
	next();
});

router.param('start', function(req, res, next, start) {
	// validation step
	req.start = start;
	next();
});

router.param('end', function(req, res, next, end) {
	// validation step
	req.end = end;
	next();
});

router.param('qty', function(req, res, next, qty) {
	// validation step
	req.qty = qty;
	next();
});

router.param('type', function(req, res, next, type) {
	// validation step
	req.type = type;
	next();
});

router.param('macaddress', function(req, res, next, macaddress) {
    // validation step
    req.macaddress = macaddress;
    next();
});

router.param('userid', function(req, res, next, userid) {
    // validation step
    req.userid = userid;
    next();
});

router.param('number', function(req, res, next, number) {
    // validation step
    req.number = number;
    next();
});

router.param('key', function(req, res, next, key) {
    // validation step
    req.key = key;
    next();
});

router.param('message', function(req, res, next, message) {
    // validation step
    req.message = message;
    next();
});

///Actual routes

router.post('/sensor', function(req,res){

	var sensorDate = new Date(req.body.value_ts);
	var sensorType = req.body.sensor_id.substring( 0, req.body.sensor_id.indexOf("_"));
	var quarterHour;
	var x = parseInt(dateFormat(sensorDate, "MM"));
    var sensorToMinute = dateFormat(sensorDate, "yyyymmddHHMM");
    var sensorSecondBucket = (Math.round(dateFormat(sensorDate, "ss")/5));
    if (sensorSecondBucket < 10) {sensorSecondBucket = "0" + sensorSecondBucket}
    var sensorToSecondBucket = sensorToMinute + sensorSecondBucket;


	switch(true) {

	case (x <= 15):
		quarterHour = '0';
		break;
	case (x <= 30):
		quarterHour = '1';
		break;
	case (x <= 45):
		quarterHour = '2';
		break;
	case (x <= 60):
		quarterHour = '3';
		break;
	}

    if (!req.body.value) {
        return;
    }

		var query1a = "insert into sensor_last (sensor_type, sensor_id, value, value_ts) values('" +
		 sensorType +  "', '" + req.body.sensor_id + "', " + req.body.value + ", '" + dateFormat(sensorDate, "isoDateTime") + "')"

        var query1b = "update sensor_count_5sec set sensors = sensors + {'" + req.body.sensor_id + "'} where report_date = '"
                + dateFormat(sensorDate, "yyyymmdd") + "' and report_ts = '" +
                sensorToSecondBucket + "'"

	  	var query1c = "insert into sensor_date (sensor_id, value_date, value_ts, value) values('" + req.body.sensor_id +
	  	"', '" + dateFormat(sensorDate, "yyyymmdd") + "', '" + dateFormat(sensorDate, "isoDateTime") + "'," + req.body.value + ")"

        var query1d = "insert into sensor_48h (sensor_id, value, value_ts) values('" +
                 req.body.sensor_id + "', " + req.body.value + ", '" + dateFormat(sensorDate, "isoDateTime") + "')"

		var query3  = "update event_count_date set event_count = event_count + 1 where sensor_type = '" +
		  	  sensorType + "' and event_date = '" +
		  		dateFormat(sensorDate, "yyyymmdd") + "' and event_ts = '" + dateFormat(sensorDate, "isoDateTime") + "'"

		var query4  = "update event_count_date set event_count = event_count + 1 where sensor_type = 'all' and event_date = '" +
	  			dateFormat(sensorDate, "yyyymmdd") + "' and event_ts = '" + dateFormat(sensorDate, "isoDateTime") + "'"

		var query5  = "update sensor_hour_avg set hour_count = hour_count + 1, hour_total = hour_total + " + parseInt(req.body.value * 100) +
					" where sensor_id = '" + req.body.sensor_id + "' and event_date_hour = '" + dateFormat(sensorDate, "yyyymmddHH") + "'"

		var query6  = "update sensor_type_hour_avg set hour_count = hour_count + 1, hour_total = hour_total + " + parseInt(req.body.value * 100) +
					" where sensor_id = '" + req.body.sensor_id + "' and event_date_hour = '" +
					dateFormat(sensorDate, "yyyymmddHH") + "' and sensor_type = '" + sensorType + "'"

		var query7  = "update sensor_qtr_hour_avg set qtr_hour_count = qtr_hour_count + 1, qtr_hour_total = qtr_hour_total + " + parseInt(req.body.value * 100) +
					" where sensor_id = '" + req.body.sensor_id + "' and event_date_qtr_hour = '" + dateFormat(sensorDate, "yyyymmddHH") + quarterHour + "'"

        var query8  = "update message_count_hour set message_count = message_count + 1 where event_date = '" +
            dateFormat(sensorDate, "yyyymmdd") + "' and event_hour = '" + dateFormat(sensorDate, "yyyymmddHH") + "'"

		//var query5  = "update sensor_hour_avg set hour_count = hour_count + 1, hour_total = hour_total + ? where sensor_id = ? and event_date_hour = ?"

		//var params5 = [req.body.value, req.body.sensor_id, dateFormat(sensorDate, "yyyymmddHH")];

	var consistency = cql.types.consistencies.one;

    client.execute(query1a, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        //else console.log('query 1a success');
    });
    client.execute(query1b, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        //else console.log('query 1b success');
    });
    client.execute(query1c, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        //else console.log('query 1c success');
    });
    client.execute(query1d, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        //else console.log('query 1d success');
    });
  	client.execute(query3, consistency, function(err) {
	 if (err) {
		 console.log(err);
  		  res.send(err);
  	  }
     //else console.log('query 3 success');
  	});
  	client.execute(query4, consistency, function(err) {
	 if (err) {
		 console.log(err);
  		  res.send("4: " + err);
  	  }
     //else console.log('query 4 success');
  	});
  	client.execute(query5, consistency, function(err) {
	 if (err) {
		 console.log("5: " + err);
  		  res.send(err);
  	  }
     //else console.log('query 5 success');
  	});
  	client.execute(query6, consistency, function(err) {
	 if (err) {
		 console.log("6: " + err);
  		  res.send(err);
  	  }
     //else console.log('query 6 success');
  	});
  	client.execute(query7, consistency, function(err) {
	 if (err) {
		 console.log("7: " + err);
  		  res.send(err);
  	  }
     //else console.log('query 7 success');
  	});
    client.execute(query8, consistency, function(err) {
        if (err) {
            console.log("8: " + err);
            res.send(err);
        }
       // else console.log('query 8 success');
    });
	res.send(200);
})

router.post('/netsensor', function(req,res){

    var sensorDate = new Date(req.body.rssi_ts * 1000);
    console.log(req.body.rssi_ts)
    console.log(sensorDate.valueOf())

    var queries = [
        {
            query: "insert into netmon_date (sensor_id, rssi_date, rssi_ts, device_id, rssi) values('" +
             req.body.sensor_id + "', '" +  dateFormat(sensorDate, "yyyymmdd") + "','" +
                dateFormat(sensorDate, "isoDateTime") + "','" + req.body.device_id +
            "'," + req.body.rssi + ")"
        },
        {
            query: "insert into netmon_last (sensor_id, device_id, rssi) values('" +
                req.body.sensor_id + "', '" +  req.body.device_id +
                "'," + req.body.rssi + ")"
        },
        {
            query: "insert into device_date (sensor_id, rssi_date, rssi_ts, device_id, rssi) values('" +
                req.body.sensor_id + "', '" +  dateFormat(sensorDate, "yyyymmdd") + "','" +
                dateFormat(sensorDate, "isoDateTime") + "','" + req.body.device_id +
                "'," + req.body.rssi + ")"
        },
        {
            query: "insert into device_last (sensor_id, device_id, rssi) values('" +
                req.body.sensor_id + "', '" +  req.body.device_id +
                "'," + req.body.rssi + ")"
        }
    ];

    //var consistency = cql.types.consistencies.localQuorum;
    var consistency = cql.types.consistencies.one;
    client.executeBatch(queries, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
        }
    });

    if (req.body.rssi > rssiLimit) {

        deliverOffer(req.body.device_id);

    }

    res.send(200);
})

router.post('/netsensorall', function(req,res){
    var sensorDate = new Date(req.body.rssi_ts * 1000);
    var consistency = cql.types.consistencies.one;
    var now = new Date();

    var range = Math.round(req.body.rssi / 5);

    var queryAll = "update net_device_count set devices = devices + {'"
            + req.body.device_id + "'} where sensor_id = '" + req.body.sensor_id +
            "' and datekey = '" +
            dateFormat(sensorDate, "yyyymmdd") + "' and timeslot = '" +
            dateFormat(sensorDate, "yyyymmddHHMMss") + "' and range = " + range + ";";

    var queryDeviceCache = "insert into devices_cache (device_id, rssi) values('" +
                            req.body.device_id +
                            "'," + req.body.rssi + ")"

    if ((whitelist_stamp.valueOf() / 1000) < ((now.valueOf() / 1000) - 30) ) {

        updateWhitelist();

    }

    //whitelist only processing

    if (whitelist.indexOf(req.body.device_id) != -1) {

        var queries = [
            {
                query: "insert into netmon_date (sensor_id, rssi_date, rssi_ts, device_id, rssi) values('" +
                    req.body.sensor_id + "', '" + dateFormat(sensorDate, "yyyymmdd") + "','" +
                    dateFormat(sensorDate, "isoDateTime") + "','" + req.body.device_id +
                    "'," + req.body.rssi + ")"
            },
            {
                query: "insert into netmon_last (sensor_id, device_id, rssi) values('" +
                    req.body.sensor_id + "', '" + req.body.device_id +
                    "'," + req.body.rssi + ")"
            },
            {
                query: "insert into device_date (sensor_id, rssi_date, rssi_ts, device_id, rssi) values('" +
                    req.body.sensor_id + "', '" + dateFormat(sensorDate, "yyyymmdd") + "','" +
                    dateFormat(sensorDate, "isoDateTime") + "','" + req.body.device_id +
                    "'," + req.body.rssi + ")"
            }


        ];

        client.executeBatch(queries, consistency, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
            }
        });

        console.log('joaquin:rssi: ' + req.body.rssi);

        if (req.body.rssi > rssiLimit) {
            deliverOffer(req.body.device_id);

        }
    }

    //Now write ALL messages out to new table


    client.execute(queryAll, consistency, function(err) {
        if (err) {
            console.log(err);
        }
    });

    client.execute(queryDeviceCache, consistency, function(err) {
        if (err) {
            console.log(err);
        }

        res.send(200);
    });



});

router.post('/message', function(req,res) {

    if (req.body.key == 'send123') {

        sendMessage(req.body.number, req.body.message)
    }
    res.send(200);

});

router.post('/whitelist', function(req,res){

    var queries = [
        {
            query: "insert into whitelist (device_id, device_description, device_name, user_id, user_name) values('" +
                req.body.device_id.toLowerCase() + "', '" + req.body.device_description + "', '"
                + req.body.device_name + "', '" + req.body.user_id + "', '" + req.body.user_name + "' )"
        }
    ];

    //var consistency = cql.types.consistencies.localQuorum;
    var consistency = cql.types.consistencies.one;
    client.executeBatch(queries, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
        }
    });

    res.send(200);
})

router.delete('/whitelist/:macaddress', function(req,res){

    var queries = [
        {
            query: "delete from whitelist where device_id = '" + req.body.device_id +"' )"
        }
    ];

    //var consistency = cql.types.consistencies.localQuorum;
    var consistency = cql.types.consistencies.one;
    client.executeBatch(queries, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
        }
    });

    res.send(200);
})

router.post('/userinfo', function(req,res){

    var queries = [
        {
            query: "insert into userinfo (user_id, user_bio, user_email, user_name, user_phone, user_skills, datastax_employee) values('" +
                req.body.user_id + "', '" + req.body.user_bio + "', '" +
                req.body.user_email + "', '" + req.body.user_name + "', '"
                + req.body.user_phone + "', '" + req.body.user_skills + "', " + !(typeof req.body.datastax_employee === 'undefined') +" )"
        }
    ];

    //var consistency = cql.types.consistencies.localQuorum;
    var consistency = cql.types.consistencies.one;
    client.executeBatch(queries, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
        }
    });

    res.send(200);
})

router.delete('/userinfo/:userid', function(req,res){

    var queries = [
        {
            query: "delete from userinfo where user_id = '" + req.body.user_id +"' )"
        }
    ];

    //var consistency = cql.types.consistencies.localQuorum;
    var consistency = cql.types.consistencies.one;
    client.executeBatch(queries, consistency, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
        }
    });

    res.send(200);
})



router.get('/count/type/:name', function(req, res) {
	var now = new Date();
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
	                  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var cols = [];
	var rows = [];
	var query = "select sensor_type, event_ts, event_count from event_count_date where sensor_type = '" + req.name + "' and event_date = '" +
				dateFormat( now_utc, "yyyymmdd") + "' limit 1"

    client.eachRow(query, [], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
            rows.push({"timestamp": row.event_ts, "sensor_type" : row.sensor_type, "value": parseInt(row.event_count)});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
          res.json(rows);
	  }
	);
});

router.get('/count/type/:name/qty/:qty', function(req, res) {
	var now = new Date();
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
	                  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	var rows = [];
	var query = "select event_ts, event_count from event_count_date where sensor_type = '" + req.name + "' and event_date = '" +
				dateFormat( now_utc, "yyyymmdd") + "' limit " + req.qty

	client.eachRow(query, [], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
//		rows["ts:" + row.event_ts] = parseInt(row.event_count);
		rows.push({"timestamp": row.event_ts, "value": parseInt(row.event_count)});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
		res.json(rows);
	  }
	);

});

router.get('/sensor_hour_avg/sensor_id/:name/qty/:qty', function(req, res) {
	var rows = [];
	var query = "select * from sensor_hour_avg where sensor_id = '" + req.name + "' limit " + req.qty
	client.eachRow(query, [], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
		var hour_avg = (row.hour_total / row.hour_count) / 100;
		rows.push({"sensor_id": row.sensor_id, "event_date_hour": row.event_date_hour, "hour_avg": hour_avg});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
		res.json(rows);
	  }
	);
});

router.get('/sensor_qtr_hour_avg/sensor_id/:name/qty/:qty', function(req, res) {
	var rows = [];
	var query = "select * from sensor_qtr_hour_avg where sensor_id = '" + req.name + "' limit " + req.qty
	client.eachRow(query, [], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
		var qtr_hour_avg = (row.qtr_hour_total / row.qtr_hour_count) / 100;
		rows.push({"sensor_id": row.sensor_id, "event_date_qtr_hour": row.event_date_qtr_hour, "qtr_hour_avg": qtr_hour_avg});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
		res.jsonp(rows);
	  }
	);
});

//Return hour averages for all sensor in a given type (limit)
router.get('/sensor_hour_avg/sensor_type/:type/qty/:qty', function(req, res) {


    var rows = [];

    var query = "select * from sensor_type_hour_avg where sensor_type = '" + req.type + "' limit " + req.qty
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var hour_avg = (row.hour_total / row.hour_count) / 100;
            rows.push({"sensor_id": row.sensor_id, "event_date_hour": row.event_date_hour, "hour_avg": hour_avg});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});


//Return last reading for all sensors
//Updated for Google Charts
router.get('/sensor_last', function(req, res) {

    var newRow = {};
    var rows = [];

    var query = "select * from sensor_last";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"timestamp": row.value_ts,  "sensor" : row.sensor_id, "value" : row.value});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/sensor_last/qty/:qty', function(req, res) {

    var rows = [];

    var query = "select * from sensor_last limit " + req.qty;
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"timestamp": row.value_ts,  "sensor" : row.sensor_id, "value" : row.value});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/sensor_last/:sensor_id', function(req, res) {

    var rows = [];

    var query = "select * from sensor_last where sensor_type = 'weight' and sensor_id =  '" + req.sensor_id + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"timestamp": row.value_ts,  "sensor_id" : row.sensor_id, "value" : row.value});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/sensor_last/type/:type/sensor/:sensor_id', function(req, res) {

    var rows = [];
    var valString;

    var query = "select * from sensor_last where sensor_type = '" + req.type + "' and sensor_id =  '" + req.sensor_id + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push("&value=" + row.value);
            valString = "&value=" + row.value;
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.send(valString);
        }
    );
});

router.get('/snack_units/:sensor_id', function(req, res) {

    var rows = [];
    var valString;

    var snack = req.sensor_id.substring(req.sensor_id.indexOf('_') + 1)

    var query = "select * from sensor_last where sensor_type = 'weight' and sensor_id =  '" + req.sensor_id + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push("&value=" + row.value);
            if (row.value != 0) {
                valString = "&value=" + Math.floor(row.value / snack_weights[snack]);
            }
            else {
                valString = "&value=" + row.value;
            }
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.send(valString);
        }
    );
});

router.get('/sensor_last/type/:type', function(req, res) {

    var rows = [];

    var query = "select * from sensor_last where sensor_type = '" + req.type + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"timestamp": row.value_ts,  "sensor_id" : row.sensor_id, "value" : row.value});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/consumption7/:sensor_id', function(req, res) {

    var rows = [];

    var query = "select * from consumption_7day where sensor_id =  '" + req.sensor_id + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            if (row.duration != 0) {

                console.log(row.duration);

                rows.push({"sensor_id": row.sensor_id, "rate": row.rate});
            }
        },
        function (err, rowLength) {
            if (err) {
                console.log("consumption read error")
                console.log(err);
            }
            res.json(rows);
        }
    );
});

router.get('/hourstoempty/:sensor_id', function(req, res) {

    var rows = [];

    var query = "select * from consumption_7day where sensor_id =  '" + req.sensor_id + "';";
    var query2 = "select * from sensor_last where sensor_id = '" + req.sensor_id + "';";

    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            if (row.duration != 0) {

                console.log(row.duration);

                rows.push({"sensor_id": row.sensor_id, "rate": row.rate});
            }
        },
        function (err, rowLength) {
            if (err) {
                console.log("consumption read error")
                console.log(err);
            }
            res.json(rows);
        }
    );
});

router.get('/sensor/:sensor_id/day/:day', function(req, res) {
	var rows = [];
	var query = "select * from sensor_date where sensor_id = '" + req.sensor_id + "' and value_date = '" + req.day + "'"
	client.eachRow(query, [], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
//		rows["ts:" + row.event_ts] = parseInt(row.event_count);
		rows.push({"sensor_id": row.sensor_id, "sensor_date": row.sensor_date, "value_ts": row.value_ts, "value": parseFloat(row.value)});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
		res.jsonp(rows);
	  }
	);

});

router.get('/message_count_hour/qty/:qty', function(req, res) {

    var now = new Date();
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    var rows = [];


    var query = "select * from message_count_hour where event_date = '" + dateFormat(now_utc, "yyyymmdd") + "' limit " + req.qty
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
//		rows["ts:" + row.event_ts] = parseInt(row.event_count);
            rows.push({"event_hour": row.event_hour, "message_count": parseInt(row.message_count)});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.jsonp(rows);
        }
    );

});

router.get('/sensor/:sensor_id/day/:day/qty/:qty', function(req, res) {
	var rows = [];
	var query = "select * from sensor_date where sensor_id = '" + req.sensor_id + "' and value_date = '" + req.day + "' limit " + req.qty
	client.eachRow(query,[], consistency, function(n, row) {
	    //the callback will be invoked per each row as soon as they are received
		rows.push({"sensor_id": row.sensor_id, "sensor_date": row.value_date, "value_ts": row.value_ts, "value": parseFloat(row.value)});
	  },
	  function (err, rowLength) {
	    if (err) console.log(err);
		res.jsonp(rows);
	  }
	);

});


router.get('/sensor/:sensor_id/day/:day/start/:start/end/:end', function(req, res) {
	var rows = [];
	var query = "select * from sensor_date where sensor_id = '" + req.sensor_id + "' and value_date = '" + req.day +
			"' and value_ts > '" + req.start + "' and value_ts < '" + req.end + "'"
	client.execute(query, [], consistency, function(err, result)	{
		if (err){
			console.log('db error')
			res.send(err);
		}
		else{

			//this is pointless, but may want to restructure return values later...
			for( var i = 0; i < result.rowCount; i++ ) {
				rows.push(result.rows[i]);
				console.log(result.rows[i]);
			}
			res.json(result);
		}
	});
});

router.get('/user_last', function(req, res) {
    var rows = [];
    var users = [];
    var query2 = " select user_id, user_ts, latitude, longitude from user_last;";
    var query1 = "select * from userinfo;";

    var lookup = {};
    for (var i = 0, len = users.length; i < len; i++) {
        lookup[users[i].user_id] = users[i];
    }


    client.eachRow(query1, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            users.push({"user_id": row.user_id,  "user_phone" : row.user_phone, "user_name" : row.user_name});
        },
        function (err, rowLength) {
            if (err) console.log(err);
                console.log(users)
                client.eachRow(query2, [], consistency, function(n, row2) {
                        //the callback will be invoked per each row as soon as they are received
                        var d = new Date(row2.value_ts);
                        var user
                        var currentUser = _.findWhere(users, {"user_id": row2.user_id});
                        if (currentUser) {
                           user = currentUser['user_name']
                        }
                        else {
                            user = "none"
                        }

                        rows.push({"timestamp": row2.user_ts,  "user" : row2.user_id, "latitude" : row2.latitude, "longitude" : row2.longitude, "user_name" : user});
                    },
                    function (err, rowLength) {
                        if (err) console.log(err);
                        res.json(rows);
                    }
                );
        }
    );
});

router.get('/user_hist/user/:userid/qty/:qty', function(req, res) {
    var rows = [];
    var query = " select * from  user_hist where user_id = '" + req.userid + "' limit " + req.qty
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.unshift({"user_id": row.user_id,  "user_ts" : row.user_ts, "latitude" : row.latitude, "longitude" : row.longitude, "ip_address": row.ip_address});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/netmon_last', function(req, res) {

    var rows = [];

    var query = "select * from netmon_last"
    client.eachRow(query,[], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var hour_avg = (row.hour_total / row.hour_count) / 100;
            rows.push({"sensor_id": row.sensor_id, "device_id": row.device_id, "rssi": row.rssi});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/live_macs', function(req, res) {

    var rows = [];

    var query = "select * from devices_cache"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var hour_avg = (row.hour_total / row.hour_count) / 100;
            rows.push({"value": row.device_id.toUpperCase(), "data": row.device_id.toUpperCase()});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json({"suggestions": rows});
        }
    );
});

router.get('/live_mac_search', function(req, res) {

    var rows = [];

    var query = "select * from devices_cache"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var hour_avg = (row.hour_total / row.hour_count) / 100;
            //Only include if macaddress matches part of device_id string

            var mac = req.param('term').toLowerCase()
            var device = row.device_id.toLowerCase()

            if (device.indexOf(mac) != -1) {
                rows.push({"label": row.device_id.toUpperCase(), "value": row.device_id.toUpperCase()});
            }
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/net_devices', function(req, res) {

    var rows = [];
    var timestamp = null;

    var now = new Date();
    var query = "select * from net_device_count WHERE sensor_id='" + 'c0:3f:d5:66:07:0d' + "' AND datekey='" + dateFormat(now, "yyyymmdd") + "' LIMIT 2000;";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            if (!timestamp) {
                timestamp = parseInt(row.timeslot);
            }

            // only read past 10 seconds of history
            if (parseInt(row.timeslot) < timestamp - 60) {
                return;
            }

            rows.push({"timestamp": parseInt(row.timeslot), "range": row.range, "devices": row.devices.length});

        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/net_device_count', function(req, res) {

    var rows = {};
    var timestamp = null;

    var now = new Date();
    var query = "select * from net_device_count WHERE sensor_id='" + 'c0:3f:d5:66:07:0d' + "' AND datekey='" + dateFormat(now, "yyyymmdd") + "' LIMIT 2000;";
    client.eachRow(query, [], cql.types.consistencies.localQuorum, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            if (!timestamp) {
                timestamp = parseInt(row.timeslot);
            }

            // only read past 10 seconds of history
            if (parseInt(row.timeslot) < timestamp - 10) {
                return;
            }

            for (var deviceCount = 0; deviceCount < row.devices.length; deviceCount++) {
                device = row.devices[deviceCount];

                // keep track of set using keys in a map
                rows[device] = 1;
            }
        },
        function (err, rowLength) {
            if (err) console.log(err);
            // res.json(rows);


//            function findNames(devices) {
//                var names = [];
//                devices.forEach(function(device) {
//                    console.log('joaquin:first');
//                    if (device) {
//                        var query = "select * from whitelist WHERE device_id='" + device + "';";
//                        console.log('joaquin:' + query);
//                        client.eachRow(query, [], consistency, function(n, row) {
//                            console.log('joaquin:row:' + row.user_name);
//                            console.log('joaquin:names1:' + names);
//                            names.push(row.user_name);
//                            console.log('joaquin:names2:' + names);
//                        },
//                        function (err, x) {
//                            if (err) console.log(err);
//                        });
//                    }
//                },
//                function(err, x) {
//                    console.log('joaquin:sending:' + names);
//                    only return the devices().length
//                    res.json({'device_count': devices.length, 'names': names});
//                });
//            }
//
//            findNames(Object.keys(rows));
            res.json(Object.keys(rows).length);
        }
    );
});

router.get('/net_device_count_macs', function(req, res) {

    var rows = {};
    var timestamp = null;

    var now = new Date();
    var query = "select * from net_device_count WHERE sensor_id='" + 'c0:3f:d5:66:07:0d' + "' AND datekey='" + dateFormat(now, "yyyymmdd") + "' LIMIT 2000;";
    client.eachRow(query, [], cql.types.consistencies.localQuorum, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            if (!timestamp) {
                timestamp = parseInt(row.timeslot);
            }

            // only read past 10 seconds of history
            if (parseInt(row.timeslot) < timestamp - 10) {
                return;
            }

            for (var deviceCount = 0; deviceCount < row.devices.length; deviceCount++) {
                device = row.devices[deviceCount];

                // keep track of set using keys in a map
                rows[device] = 1;
            }
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);

            // only return the keys().length
            // res.json(Object.keys(rows).length);
        }
    );
});

router.get('/sensorcount', function(req, res) {

    var now = new Date();
    var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var rows = [];

    var query = "select * from sensor_count_5sec where report_date = '" + dateFormat(now_utc, "yyyymmdd") + "' limit 1"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            rows.push({"report_date": row.report_date, "report_ts": row.report_ts, "sensors": row.sensors.length});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/whitelist', function(req, res) {
    var rows = [];
    var query = " select device_id from whitelist;"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            rows.push(row.device_id);
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/device/:macaddress', function(req, res) {
    var rows = [];
    var query = " select * from whitelist where device_id = '" + req.body.macaddress + "';"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"user_id": row.user_id,  "device_id" : row.device_id, "device_name" : row.device_name, "device_description" : row.device_description});
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/userinfo/:userid', function(req, res) {
    var rows = [];
    var query = " select * from userinfo where user_id = '" + req.body.userid + "';"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            var d = new Date(row.value_ts);
            rows.push({"user_id": row.user_id,  "user_bio" : row.user_bio, "user_email" : row.user_email, "user_name" : row.user_name, "user_other" : row.user_other, "user_skills" : row.user_skills})
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/netmon_down', function(req, res) {
    var rows = [];
    var query = " select * from coffice.netmon_down;";
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            rows.push(row.phone);
        },
        function (err, rowLength) {
            if (err) console.log(err);
            res.json(rows);
        }
    );
});

router.get('/uuid', function(req, res) {

    res.json(uuid.v1());

});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function deliverOffer(deviceid) {

    var foundPhone = false;



    //Get user_id from whitelist
    var query = "select * from whitelist where device_id = '" + deviceid + "';";
    client.eachRow(query, [], consistency, function(n, row) {
            //Get userinfo for device passed in
            var query2 = "select * from userinfo where user_id = '" +  row.user_id + "'";

            client.eachRow(query2, [], consistency, function(n2, row2) {



                    if (row2.datastax_employee) {

                        offerTimeTable = "sms_1m";
                       
                    }
                    else {

                        offerTimeTable = "sms_60m";
                    }



                    //Test for message velocity, only send if not seem in past _x_ minutes
                    var query3 = "select * from " + offerTimeTable +  " where user_phone = '" +  row2.user_phone + "'";
                    client.eachRow(query3, [], consistency, function(n3, row3) {

                        foundPhone = true;

                        },
                        function (err, rowLength) {
                            if (err) console.log(err);

                            //if we didn't get a match, send a message
                            if (!foundPhone) {
                                var value = -1000;
                                var snack = null;
                                var query = "SELECT * FROM coffice.sensor_last WHERE sensor_type='weight';";
                                client.eachRow(query, [], consistency, function(n, row) {
                                        //the callback will be invoked per each row as soon as they are received
                                        if (row.value > value) {
                                            value = row.value;
                                            snack = row.sensor_id.split('_')[1];
                                            snack = toTitleCase(row.sensor_id.split('_')[1]);
                                            if (snack == 'Granolabars') {
                                                snack = 'Granola Bars';
                                            }
                                        }
                                    },
                                    function (err, rowLength) {
                                        if (err) console.log(err);


                                        var messageToSend = "Hey " + row2.user_name + ", grab some " + snack + "! We've got lots!";
                                        sendMessage(row2.user_phone, messageToSend);
                                        console.log('joaquin:sendingtext:' + messageToSend);

                                        //now update tables to track message being sent

                                        var query1 = "insert into sms_1m (user_phone, message_type, device_id) values('" +
                                            row2.user_phone +  "', '1', '" + deviceid + "');";

                                        var query2 = "insert into sms_5m (user_phone, message_type, device_id) values('" +
                                            row2.user_phone +  "', '1', '" + deviceid + "');";

                                        var query3 = "insert into sms_15m (user_phone, message_type, device_id) values('" +
                                            row2.user_phone +  "', '1', '" + deviceid + "');";

                                        var query4 = "insert into sms_60m (user_phone, message_type, device_id) values('" +
                                            row2.user_phone +  "', '1', '" + deviceid + "');";

                                        var consistency = cql.types.consistencies.one;

                                        client.execute(query1, consistency, function(err) {
                                            if (err) {
                                                console.log(err);
                                            }

                                        });

                                        client.execute(query2, consistency, function(err) {
                                            if (err) {
                                                console.log(err);
                                            }

                                        });

                                        client.execute(query3, consistency, function(err) {
                                            if (err) {
                                                console.log(err);
                                            }

                                        });

                                        client.execute(query4, consistency, function(err) {
                                            if (err) {
                                                console.log(err);
                                            }

                                        });
                                    }
                                );

                            }

                        })

            },
            function (err, rowLength) {
                if (err) console.log(err)
            })

        },
        function (err, rowLength) {
            if (err) console.log(err);
        }
    );


}


function sendMessage(number, messageBody) {

    var twilio = require('twilio');
    var client = new twilio.RestClient('ACb8ade9d1ca1845b99e69b4cc743a9dea', '406b5433caf7ffad7ab26e30f179452a');

        client.sendSms({
            to: number,
            from: '+14248887829',
            body: messageBody
        }, function (error, message) {
            // The HTTP request to Twilio will run asynchronously. This callback
            // function will be called when a response is received from Twilio
            // The "error" variable will contain error information, if any.
            // If the request was successful, this value will be "falsy"
            if (!error) {
                // The second argument to the callback will contain the information
                // sent back by Twilio for the request. In this case, it is the
                // information about the text messsage you just sent:
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);

                console.log('Message sent on:');
                console.log(message.dateCreated);
            } else {
                console.log('Oops! There was an error.');
            }
        })
    }

function updateWhitelist() {

    var rows = [];
    whitelist = [];
    var query = "select device_id from whitelist;"
    client.eachRow(query, [], consistency, function(n, row) {
            //the callback will be invoked per each row as soon as they are received
            rows.push(row.device_id);
        },
        function (err, rowLength) {
            if (err) console.log(err);
            whitelist = rows;
            whitelist_stamp = new Date();
            console.log("whitelist updated:" + whitelist);

        }
    );

}

updateWhitelist();

module.exports = router;
