import core.Simulation;
import org.json.JSONObject;
import queueing.*;

public class ModelFactory {

    public Model createModel(JSONObject json) {
        Model model = new Model();

        Simulation sim = new Simulation();

        QObject source = new Source(sim);
        QObject queue = new Queue(sim);
        QObject splitter = new Splitter(sim);
        QObject sink = new Sink(sim);

        source.connectTo(queue);
        queue.connectTo(splitter);
        splitter.connectTo(sink, queue, 0.5);

        return model;
    }
}
