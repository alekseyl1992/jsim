package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Stats {
    public static final String ID = "id";
    public static final String STATS = "stats";

    public static String toJsonString(String id, JSONObject stats) {
        JSONObject json = new JSONObject();
        json.put(ID, id);
        json.put(STATS, stats);
        
        return json.toString();
    }
}
