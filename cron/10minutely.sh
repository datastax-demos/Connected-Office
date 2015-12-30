#!/bin/sh

dse shark <<EOF
INSERT OVERWRITE TABLE coffice.sensor_rollup
SELECT
    sensor_id,
    rollup_type,
    rollup_ts,
    AVG(value) AS avg_value,
    MAX(value) AS max_value,
    PERCENTILE_APPROX(value, 0.5) AS median_value,
    MIN(value) AS min_value,
    PERCENTILE_APPROX(value, 0.01) AS p01_value,
    PERCENTILE_APPROX(value, 0.05) AS p05_value,
    PERCENTILE_APPROX(value, 0.95) AS p95_value,
    PERCENTILE_APPROX(value, 0.99) AS p99_value,
    STDDEV(value) AS stddev_value
FROM (
    SELECT
        sensor_id,
        rollup_ts,
        rollup_type,
        value
    FROM (
        SELECT
            value_ts,
            sensor_id,
            CONCAT(SUBSTR(value_ts, 0, 15), '0:00') AS rollup_ts,
            '10minute' AS rollup_type,
            value
        FROM coffice.sensor_date
        WHERE value_ts LIKE '%-%'
    ) q1
        JOIN (
            SELECT
                MAX(rollup_ts) AS max_rollup_ts
            FROM coffice.sensor_rollup
            WHERE rollup_type = '10minute'
        ) q2
        WHERE rollup_ts >= max_rollup_ts
) q3
GROUP BY sensor_id, rollup_ts, rollup_type
ORDER BY sensor_id, rollup_ts;
EOF
