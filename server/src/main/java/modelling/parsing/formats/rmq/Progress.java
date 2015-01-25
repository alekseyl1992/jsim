package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Progress {
    public static final String TASK_ID = "taskId";
    public static final String PROGRESS = "progress";

    public static String toJsonString(String taskId, double progress) {
        JSONObject json = new JSONObject();
        json.put(TASK_ID, taskId);
        json.put(PROGRESS, progress);
        
        return json.toString();
    }
}
