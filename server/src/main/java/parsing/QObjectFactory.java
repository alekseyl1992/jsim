package parsing;

import core.Simulation;
import org.json.JSONException;
import org.json.JSONObject;
import parsing.enums.Type;
import queueing.QObject;

public class QObjectFactory {
    private Simulation sim;

    public QObjectFactory(Simulation sim) {
        this.sim = sim;
    }

    public QObject createQObject(JSONObject json)
            throws ModelParsingError {

        try {
            String typeStr = json.getString("type");
            Type type = Type.fromString(typeStr);

            if (type == null)
                throw new ModelParsingError("Unsupported type: " + typeStr);

            switch (type) {
                case SOURCE:
                    return createSource(json);
                case QUEUE:
                    return createQueue(json);
                case SPLITTER:
                    return createSplitter(json);
                case SINK:
                    return createSink(json);
                default:
                    throw new ModelParsingError("Unimplemented type: " + type);
            }
        }
        catch (JSONException e) {
            throw new ModelParsingError(e);
        }
    }

    private QObject createSource(JSONObject json) {
        return null;
    }

    private QObject createQueue(JSONObject json) {
        return null;
    }

    private QObject createSplitter(JSONObject json) {
        return null;
    }

    private QObject createSink(JSONObject json) {
        return null;
    }
}
