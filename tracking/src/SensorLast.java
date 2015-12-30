import com.datastax.driver.core.Row;


public class SensorLast {
	private String sensor_type;
	private String sensor_id;
	private double value;
	private String value_ts;
	
	public SensorLast(Row row){
		this.setSensor_id(row.getString("sensor_id"));
		this.setSensor_type(row.getString("sensor_type"));
		this.setValue(row.getDouble("value"));
		this.setValue_ts(row.getString("value_ts"));
	}
	  
	public String getSensor_type() {
		return sensor_type;
	}
	public void setSensor_type(String sensor_type) {
		this.sensor_type = sensor_type;
	}
	public String getSensor_id() {
		return sensor_id;
	}
	public void setSensor_id(String sensor_id) {
		this.sensor_id = sensor_id;
	}
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
	public String getValue_ts() {
		return value_ts;
	}
	public void setValue_ts(String value_ts) {
		this.value_ts = value_ts;
	}
	  
}
