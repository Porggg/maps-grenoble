import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class JsonRequest {
    @SuppressWarnings("deprecation")
    public static String sendGetRequest(String name) {
        try {
        URL url = new URL("https://data.mobilites-m.fr/api/ficheHoraires/json?route=SEM%3A"+name);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        
        return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "ERROR";
    }
    
    public static void main(String[] args) {
        String name = "A";
        System.out.println(sendGetRequest(name));
    }
}
