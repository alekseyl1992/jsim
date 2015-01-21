package modelling.parsing;

import org.json.JSONException;
import org.json.JSONObject;
import modelling.parsing.formats.model.QObjectFields;
import modelling.parsing.formats.model.SpecFields;
import modelling.parsing.formats.model.QObjectTypes;
import queueing.*;

public class QObjectFactory {
    private Model model;

    public QObjectFactory(Model model) {
        this.model = model;
    }

    public QObject createQObject(JSONObject json)
            throws ModelParsingError {

        try {
            String type = json.getString(QObjectFields.TYPE);
            String id = json.getString(QObjectFields.ID);

            switch (type) {
                case QObjectTypes.SOURCE:
                    return createSource(json).setId(id);
                case QObjectTypes.QUEUE:
                    return createQueue(json).setId(id);
                case QObjectTypes.SPLITTER:
                    return createSplitter(json).setId(id);
                case QObjectTypes.SINK:
                    return createSink(json).setId(id);
                default:
                    throw new ModelParsingError("Unsupported type: " + type);
            }
        }
        catch (JSONException e) {
            throw new ModelParsingError(e);
        }
    }

    private QObject createSource(JSONObject json) {
        JSONObject spec = json.getJSONObject(QObjectFields.SPEC);

        double lambda = spec.getDouble(SpecFields.LAMBDA);
        QObject source = new Source(model.getSim(), lambda, model.getRandom());

        return source;
    }

    private QObject createQueue(JSONObject json) {
        JSONObject spec = json.getJSONObject(QObjectFields.SPEC);

        int sizeLimit = spec.getInt(SpecFields.LIMIT);
        int channels = spec.getInt(SpecFields.CHANNELS);
        double mu = spec.getDouble(SpecFields.MU);

        QObject queue = new Queue(model.getSim(), sizeLimit, channels, mu, model.getRandom());

        return queue;
    }

    private QObject createSplitter(JSONObject json) {
        JSONObject spec = json.getJSONObject(QObjectFields.SPEC);

        double pA = spec.getDouble(SpecFields.P_A);

        QObject splitter = new Splitter(model.getSim(), pA, model.getRandom());

        return splitter;
    }

    private QObject createSink(JSONObject json) {
        QObject sink = new Sink(model.getSim());

        return sink;
    }
}
