package modelling.parsing;

import core.stats.Plotter;
import modelling.parsing.formats.model.QObjectFields;
import modelling.parsing.formats.model.QObjectTypes;
import modelling.parsing.formats.model.SpecFields;
import modelling.queueing.*;
import org.json.JSONException;
import org.json.JSONObject;

public class QObjectFactory {
    private Model model;

    public QObjectFactory(Model model) {
        this.model = model;
    }

    public QObject createQObject(JSONObject json)
            throws ModelParsingError {
        try {
            String id = json.getString(QObjectFields.ID);
            String name = json.getString(QObjectFields.NAME);

            QObject qObject = _createQObject(json);
            qObject.setId(id);
            qObject.setName(name);

            return qObject;
        } catch (JSONException e) {
            throw new ModelParsingError(e);
        }
    }

    private QObject _createQObject(JSONObject json)
            throws ModelParsingError {

        try {
            String type = json.getString(QObjectFields.TYPE);

            switch (type) {
                case QObjectTypes.SOURCE:
                    return createSource(json);
                case QObjectTypes.QUEUE:
                    return createQueue(json);
                case QObjectTypes.SPLITTER:
                    return createSplitter(json);
                case QObjectTypes.SINK:
                    return createSink(json);
                default:
                    throw new ModelParsingError("Unsupported type: " + type);
            }
        } catch (JSONException e) {
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

        Queue queue = new Queue(model.getSim(), sizeLimit, channels, mu, model.getRandom());

        // setup plotters
        queue.setSizePlotter(new Plotter(0, model.getDuration(), Plotter.DEFAULT_BUCKETS_COUNT));
        queue.setSystemTimePlotter(new Plotter(0, model.getDuration(), Plotter.DEFAULT_BUCKETS_COUNT));
        queue.setQueueTimePlotter(new Plotter(0, model.getDuration(), Plotter.DEFAULT_BUCKETS_COUNT));

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
