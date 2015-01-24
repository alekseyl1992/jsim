package modelling.parsing.formats.rmq;

import org.json.JSONObject;

public class Error {
    public static final String ID = "id";
    public static final String MESSAGE = "message";

    public static String toJsonString(String id, Throwable e) {
        JSONObject json = new JSONObject();
        json.put(ID, id);
        json.put(MESSAGE, e.getMessage());
        
        return json.toString();
    }
}
