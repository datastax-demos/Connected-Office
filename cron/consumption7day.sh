#!/bin/sh

dse shark <<EOF
INSERT INTO TABLE coffice.consumption_7day
SELECT
    sensor_id,
    consumption,
    consumption_time,
    consumption / (consumption_time / 3600) AS hourly_consumption
FROM (
    SELECT
        sensor_id,
        consumption,
        UNIX_TIMESTAMP(CONCAT(CONCAT(SUBSTR(max_rollup_ts, 0, 10), ' '), SUBSTR(max_rollup_ts, 12, 8))) - UNIX_TIMESTAMP(CONCAT(CONCAT(SUBSTR(min_rollup_ts, 0, 10), ' '), SUBSTR(min_rollup_ts, 12, 8))) AS consumption_time
    FROM (
        SELECT
            sensor_id,
            MAX(rollup_ts) AS max_rollup_ts,
            MIN(rollup_ts) AS min_rollup_ts,
            SUM(neg_delta_max_value) AS consumption
        FROM (
            SELECT
                sensor_id,
                delta_max_value AS neg_delta_max_value,
                rollup_ts
            FROM (
                SELECT
                    sensor_id,
                    rollup_ts,
                    max_value,
                    last_max_value,
                    CASE WHEN max_value - last_max_value > 0 THEN 0.0 ELSE max_value - last_max_value END AS delta_max_value
                FROM (
                    SELECT
                        sensor_id,
                        rollup_ts,
                        max_value,
                        LAG(max_value) OVER (PARTITION BY sensor_id ORDER BY rollup_ts) AS last_max_value
                    FROM (
                        SELECT
                            sensor_id,
                            rollup_ts,
                            max_value,
                            rollup_type
                        FROM coffice.sensor_rollup
                        WHERE rollup_type = '10minute'
                        AND sensor_id LIKE 'weight_%'
                        AND 7 > DATEDIFF(FROM_UNIXTIME(unix_timestamp()), CONCAT(CONCAT(SUBSTR(rollup_ts, 0, 10), ' '), SUBSTR(rollup_ts, 12, 8)))
                    ) p1
                ) p2
            ) dweight
        ) q1
        GROUP BY sensor_id
    ) q2
) q3
ORDER BY sensor_id;
EOF
