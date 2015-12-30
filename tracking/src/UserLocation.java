import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class UserLocation {
	private String user_id;
	private String ip_address;
	private String timestamp;
	private String continent_name;
	private String country_name;
	private String region_name;
	private String city;
	private String postal_code;
	private String metro_code;
	private String area_code;
	private double latitude;
	private double longitude;
	private String organization;
	
	public UserLocation(String user_id, String json){
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
		dateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
		Date date = new Date();
		this.setTimestamp(dateFormat.format(date));
		
		this.setUser_id(user_id);
		
		JsonObject  data = new JsonParser().parse(json).getAsJsonObject();
		this.setIp_address(parseString(data, "ip_address"));
		
		JsonObject geolocation = data.getAsJsonObject("geolocation_data");
		this.setArea_code(parseString(geolocation, "area_code"));
		this.setCity(parseString(geolocation, "city"));
		this.setContinent_name(parseString(geolocation, "continent_name"));
		this.setCountry_name(parseString(geolocation, "country_name"));
		this.setLatitude(parseDouble(geolocation, "latitude"));
		this.setLongitude(parseDouble(geolocation, "longitude"));
		this.setMetro_code(parseString(geolocation, "metro_code"));
		this.setOrganization(parseString(geolocation, "organization"));
		this.setPostal_code(parseString(geolocation, "postal_code"));
		this.setRegion_name(parseString(geolocation, "region_name"));
	}
	
	private String parseString(JsonObject json, String name){
		try{
			return json.get(name).getAsString();
		}
		catch(Exception e){
			return "";
		}
	}
	
	private double parseDouble(JsonObject json, String name){
		try{
			return json.get(name).getAsDouble();
		}
		catch(Exception e){
			return 0.0;
		}
	}	
	
	public String test(){
		StringBuilder output = new StringBuilder();
		
		output.append(this.getArea_code());
		output.append("\n");
		
		output.append(this.getCity());
		output.append("\n");
		
		output.append(this.getContinent_name());
		output.append("\n");
		
		output.append(this.getCountry_name());
		output.append("\n");
		
		output.append(this.getIp_address());
		output.append("\n");
		
		output.append(this.getLatitude());
		output.append("\n");
		
		output.append(this.getLongitude());
		output.append("\n");
		
		output.append(this.getMetro_code());
		output.append("\n");
		
		output.append(this.getOrganization());
		output.append("\n");
		
		output.append(this.getPostal_code());
		output.append("\n");
		
		output.append(this.getRegion_name());
		output.append("\n");
		
		output.append(this.getTimestamp());
		output.append("\n");
		
		output.append(this.getUser_id());
		output.append("\n");
		
		return output.toString();
	}
	
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getIp_address() {
		return ip_address;
	}
	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public String getContinent_name() {
		return continent_name;
	}
	public void setContinent_name(String continent_name) {
		this.continent_name = continent_name;
	}
	public String getCountry_name() {
		return country_name;
	}
	public void setCountry_name(String country_name) {
		this.country_name = country_name;
	}
	public String getRegion_name() {
		return region_name;
	}
	public void setRegion_name(String region_name) {
		this.region_name = region_name;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getPostal_code() {
		return postal_code;
	}
	public void setPostal_code(String postal_code) {
		this.postal_code = postal_code;
	}
	public String getMetro_code() {
		return metro_code;
	}
	public void setMetro_code(String metro_code) {
		this.metro_code = metro_code;
	}
	public String getArea_code() {
		return area_code;
	}
	public void setArea_code(String area_code) {
		this.area_code = area_code;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	
}
