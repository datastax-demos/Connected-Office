

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UserServlet
 */
@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private Database db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserServlet() {
        super();
        // TODO Auto-generated constructor stub
        String nodes[] = {"10.106.69.9","10.106.69.8","10.106.69.7","10.106.69.6","10.106.69.5"};
		db = new Database(nodes, "coffice");
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String ip_address = request.getRemoteAddr();
		String user_id = "";
		String helpme = request.getParameter("helpme");
		
		if (helpme == null) helpme="";
		
        Cookie[] cookies = request.getCookies();
        boolean foundCookie = false;
        int numcookies = 0;
        
        if (cookies != null) numcookies = cookies.length;

        for(int i = 0; i < numcookies; i++) { 
            Cookie cookie1 = cookies[i];
            if (cookie1.getName().equals("user_id")) {
                user_id = cookie1.getValue();
                foundCookie = true;
            }
        }  

        if (!foundCookie) {
        	user_id = UUID.randomUUID().toString();
            Cookie cookie1 = new Cookie("user_id", user_id);
            response.addCookie(cookie1); 
        }
        
		String strurl = "http://api.ipaddresslabs.com/iplocation/v1.7/locateip?key=SAKA4GM89TS4H93GN87Z&ip=" + ip_address + "&format=JSON";
		String location = new URLReader().getText(strurl);
		UserLocation loc = new UserLocation(user_id, location);
		
		if (helpme.equals("debug")){
			response.getWriter().print(location);
			response.getWriter().print(loc.test());
		}
		else{
			db.writeLocation(loc);
			request.getRequestDispatcher("datastax.png").forward(request, response);			
		}
        
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
