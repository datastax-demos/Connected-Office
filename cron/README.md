So, the rollup scripts are actually on the .200 machine (208.96.49.200) in the /root/coffice directory.  There are a few C* tables to know about first.  In the coffice keyspace, you'll find the SENOR_ROLLUP table, with schema:

    CREATE TABLE sensor_rollup (
      sensor_id text,
      rollup_type text,
      rollup_ts text,
      avg_value double,
      max_value double,
      median_value double,
      min_value double,
      p01_value double,
      p05_value double,
      p95_value double,
      p99_value double,
      stddev_value double,
      PRIMARY KEY ((sensor_id, rollup_type), rollup_ts)
    ) WITH CLUSTERING ORDER BY (rollup_ts DESC) ... ;

The ROLLUP_TYPE column has the time-duration for the rollup ('hour', '10minute', 'day').  The ROLLUP_TS is the beginning time of the rollup period.  This makes it easy to do rollups as you can just truncate the string version of the timestamp to the 10 minute mark, the hour mark, or the day mark, and do some GROUP BY rollups.

The other table to know about holds the consumption of the snacks - the CONSUMPTION_1DAY and CONSUMPTION_7DAY tables:

    CREATE TABLE consumption_1day (
      sensor_id text,
      amt_consumed double,
      duration int,
      rate double,
      PRIMARY KEY ((sensor_id))
    )...

    CREATE TABLE consumption_7day (
      sensor_id text,
      amt_consumed double,
      duration int,
      rate double,
      PRIMARY KEY ((sensor_id))
    )...

It was just easier to keep these separate, but they could be combined if we needed to.  The RATE is the hourly rate of grams consumed over the last day or week.

There is a cron job set up to calculate these rollups as follows (crontab -l):

    0,10,20,30,40,50 * * * * /root/coffice/cron/10minutely.sh
    0 * * * * /root/coffice/cron/hourly.sh
    0 0 * * * /root/coffice/cron/daily.sh
    0 0 * * * /root/coffice/cron/consumption1day.sh
    0 0 * * * /root/coffice/cron/consumption7day.sh

So, the 10-minute rollups happen every 10 minutes, the hourly rollups happen every hour at the top of the hour, and the daily rollups happen every day at midnight.  The daily and weekly consumption rollups are calculated every night at midnight based on the past day or week.

The 10minutely, hourly, and daily rollups work off the data in the SENSOR_48H instead of the whole SENSOR_DATE table.  The script will only rollup data that hasn't been rolled up before (to a full rollup window).  That is, it will only calculate rollups for windows that have not been calculated before, plus also recalculating the most recent window in the SENSOR_ROLLUP table.  This will include a partial window of the most recent data, should it be partially filled (hence the recalculation).

The statistics calculated for the rollups are: MAX, MIN, AVG, MEDIAN, STDDEV, 1st percentile, 5th percentile 95th percentile, and 99th percentile.

The consumption1day and consumption7day rollups are calculated off of the SENSOR_ROLLUP table.  They operate on the 10minute rollup and look only at the MAX for that period.  The idea is that it wants to see the difference between 10-minute windows, but only if the value is decreasing (consumption) and not when it is increasing (re-stocking).  I know that we'll miss some things during the 10-minute window when the restocking occurs, but let's just assume it isn't *that* much.  There are other edge cases here, too, but I went with simple for now.  Then, for each 10-minute window it calculates the amount of consumption for that period.  Then, it adds those up for the whole day and also determines the first reading and last reading for the day (it might not be taking readings for the full day for some reason).  Lastly it divides those values to get the hourly consumption rate for the period.

The only difference between the 1day and 7day consumption is the window of data to consider in the rollup.

Now, there are a few other scripts in the /root/coffice directory.  They have to do with the initial rollup.  You recall that the 10minutely, hourly, and daily rollups only calculate from the last time they were calculated.  Well, the first time, the SENSOR_ROLLUP table is empty so that logic doesn't work.  The scripts with the "init_" prefix calculate all of the rollups from the SENSOR_48H table.  In addition to that, sometimes the rollups need to be initialized going way back past 2 days, so the scripts with the "init_" prefix and the "_all" suffix are the same rollup as the "init_" scripts, but operating on the SENSOR_DATE data to calculate all rollup periods.  These are bootstrap scripts and only need to get run once (or whenever we truncate the tables for some reason).

Now, having said all that, the HiveQL is not the cleanest I've written, but it was an incremental approach.  If you want to walk through the actual code, let me know (but we should probably do that "live").
