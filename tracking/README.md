# Deployment

To deploy, first build a .war file. With Eclipse, File -> Export, Web -> WAR file.

Once ConnectedOffice.war is created, copy it to the WebApps tomcat folder. In our demo server (208.96.49.199), this is located at:

    /srv/tomcat/webapps

Once copied, tomcat will extract the application and create a ConnectedOffice folder. This will now be accessible using:

http://208.96.49.199:8080/ConnectedOffice/UserServlet

For additional debug information, use: 

http://208.96.49.199:8080/ConnectedOffice/UserServlet?helpme=debug

The default tomcat port is 8080.

# Files

## src/UserServlet.java

Embed this servlet in <img\> tags to track user location data. The image displayed is the DataStax logo.

    <p><img src="UserServlet"></p>

The servlet looks for a cookie and creates one if it does not exist. It uses the user's IP address to lookup geo
information. This is gathered from a 3rd party ip lookup service.

IP Address data + the userid cookie are written to Cassandra tables.

For debugging, pass the parameter ?helpme=debug to display query results from the web service.
  
## Other Classes Used

### src/URLReader.java

For reading the web service

### src/UserLocation.java

Bean for holding writing to C*

### src/Database.java

Manages connection to C*


### WebContent/index.jsp

This is used only for testing. It uses the embedded image tracker and a sample chart.

### Classes only used for the sample chart

  src/SensorLast.java
  src/SensrServlet.java
