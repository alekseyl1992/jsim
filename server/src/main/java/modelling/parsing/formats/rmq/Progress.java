package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Progress {
    public static final String ID = "id";
    public static final String PROGRESS = "progress";

    public static String toJsonString(String id, double progress) {
        JSONObject json = new JSONObject();
        json.put(ID, id);
        json.put(PROGRESS, progress);
        
        return json.toString();
    }
}
