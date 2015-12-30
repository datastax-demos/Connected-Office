


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;



public class URLReader {
	public String getText(String strurl) throws MalformedURLException, IOException{
		URL url = new URL(strurl);
	    
		HttpURLConnection httpcon = (HttpURLConnection) url.openConnection();
	    httpcon.addRequestProperty("User-Agent", "Mozilla/4.0");
		
	    BufferedReader in = new BufferedReader(new InputStreamReader(httpcon.getInputStream()));
		
		StringBuilder result = new StringBuilder();
		String inputline;
		
		while ((inputline = in.readLine()) != null)
			result.append(inputline);
		
		in.close();
		return result.toString();
	}
	
}
