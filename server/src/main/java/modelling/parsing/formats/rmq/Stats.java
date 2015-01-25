package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Stats {
    public static final String TASK_ID = "taskId";
    public static final String STATS = "stats";

    public static String toJsonString(String taskId, JSONObject stats) {
        JSONObject json = new JSONObject();
        json.put(TASK_ID, taskId);
        json.put(STATS, stats);
        
        return json.toString();
    }
}
