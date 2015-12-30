

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SensorServlet
 */
@WebServlet("/SensorServlet")
public class SensorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private Database db;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SensorServlet() {
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
		response.getWriter().write(db.getLastReadings());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
