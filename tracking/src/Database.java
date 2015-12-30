import java.util.ArrayList;
import java.util.List;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Cluster.Builder;
import com.datastax.driver.core.policies.ConstantReconnectionPolicy;
import com.datastax.driver.core.policies.DowngradingConsistencyRetryPolicy;
import com.google.gson.Gson;


public class Database {
	private String[] nodes;
	
	private String keyspace;
	private Cluster cluster;
	private Session session;
	
	private PreparedStatement psSensorLast;
	private String sSensorLast = "select * from sensor_last";
	
	private PreparedStatement psUserLast;
	private String sUserLast = "insert into user_last(user_id, ip_address, user_ts, continent_name, country_name, region_name, city, postal_code, metro_code, area_code, latitude, longitude, organization) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	private PreparedStatement psUserHist;
	private String sUserHist = "insert into user_hist(user_id, ip_address, user_ts, continent_name, country_name, region_name, city, postal_code, metro_code, area_code, latitude, longitude, organization) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	private PreparedStatement psUserLocHist;
	private String sUserLocHist = "insert into user_loc_hist(user_id, user_ts, latitude, longitude) values(?, ?, ?, ?)";
	
	
	public String[] getNodes() {
		return nodes;
	}
	public void setNodes(String[] nodes) {
		this.nodes = nodes;
	}
	public String getKeyspace() {
		return keyspace;
	}
	public void setKeyspace(String keyspace) {
		this.keyspace = keyspace;
	}
	public Cluster getCluster() {
		return cluster;
	}
	public void setCluster(Cluster cluster) {
		this.cluster = cluster;
	}
	public Session getSession() {
		return session;
	}
	public void setSession(Session session) {
		this.session = session;
	}
	
	public Database(String nodes[], String keyspace){
		setNodes(nodes);
		setKeyspace(keyspace);
		connect();		
	}
	
	private void connect() {
		System.out.println("Creating Cluster");
		
		Builder builder = Cluster.builder();
		builder.addContactPoints(nodes);
	
		System.out.println("Setting Options");
		
		//Connection Options
		builder.withRetryPolicy(DowngradingConsistencyRetryPolicy.INSTANCE);
		builder.withReconnectionPolicy(new ConstantReconnectionPolicy(100));
		
		System.out.println("Building Cluster");
		
		cluster = builder.build();
		session = cluster.connect(keyspace);
		
		System.out.println("Retrieved Session");
	}
	
	public String getLastReadings(){
		if (psSensorLast == null) psSensorLast = session.prepare(sSensorLast);
		
		ResultSet results = session.execute(psSensorLast.bind());
		List<SensorLast> sensors = new ArrayList<SensorLast>();
		
		for (Row row:results){
			sensors.add(new SensorLast(row));
		}
		
		return new Gson().toJson(sensors);
	}
	
	public void writeLocation(UserLocation userLoc){
		if (psUserLast == null) psUserLast = session.prepare(sUserLast);
		session.execute(psUserLast.bind(userLoc.getUser_id(), userLoc.getIp_address(), userLoc.getTimestamp(), userLoc.getContinent_name(), userLoc.getCountry_name(), userLoc.getRegion_name(), userLoc.getCity(), userLoc.getPostal_code(), userLoc.getMetro_code(), userLoc.getArea_code(), userLoc.getLatitude(), userLoc.getLongitude(), userLoc.getOrganization()));
		
		if (psUserHist == null) psUserHist = session.prepare(sUserHist);
		session.execute(psUserHist.bind(userLoc.getUser_id(), userLoc.getIp_address(), userLoc.getTimestamp(), userLoc.getContinent_name(), userLoc.getCountry_name(), userLoc.getRegion_name(), userLoc.getCity(), userLoc.getPostal_code(), userLoc.getMetro_code(), userLoc.getArea_code(), userLoc.getLatitude(), userLoc.getLongitude(), userLoc.getOrganization()));

		if (psUserLocHist == null) psUserLocHist = session.prepare(sUserLocHist);
		session.execute(psUserLocHist.bind(userLoc.getUser_id(), userLoc.getTimestamp(), userLoc.getLatitude(), userLoc.getLongitude()));
	}
}
