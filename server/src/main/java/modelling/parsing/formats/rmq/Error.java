package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Error {
    public static final String TASK_ID = "taskId";
    public static final String MESSAGE = "message";

    public static String toJsonString(String taskId, Throwable e) {
        JSONObject json = new JSONObject();
        json.put(TASK_ID, taskId);
        json.put(MESSAGE, e.getMessage());
        
        return json.toString();
    }
}
