package modelling.parsing;

import core.Simulation;
import modelling.parsing.formats.stats.StatsFields;
import org.json.JSONObject;
import org.uncommons.maths.random.MersenneTwisterRNG;
import queueing.QObject;
import queueing.Queue;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.function.Consumer;

public class Model {
    private Simulation sim;
    private Random random;
    private int duration;
    
    private double progress = 0;

    private Map<String, QObject> objects = new HashMap<>();

    private Consumer<Double> progressCallback;
    
    public Model(int duration) {
        sim = new Simulation();
        random = new MersenneTwisterRNG();
        this.duration = duration;
    }

    public Model(byte[] seed, int duration) {
        sim = new Simulation();
        random = new MersenneTwisterRNG(seed);
        this.duration = duration;
    }

    public void addQObject(QObject qObject) {
        objects.put(qObject.getId(), qObject);
    }

    public void connect(String idFrom, String idTo) {
        QObject from = objects.get(idFrom);
        QObject to = objects.get(idTo);

        from.connectTo(to);
    }

    public void connect(String idFrom, String idToA, String idToB) {
        QObject from = objects.get(idFrom);
        QObject toA = objects.get(idToA);
        QObject toB = objects.get(idToB);

        from.connectTo(toA, toB);
    }

    public JSONObject startSimulation() {
        sim.start(duration);

        // format statistics
        JSONObject stats = new JSONObject();

        for (QObject qObject: objects.values()) {
            JSONObject objStats = new JSONObject();
            objStats.put(StatsFields.USE_COUNT, qObject.getUseCount());

            if (qObject instanceof Queue) {
                Queue queue = (Queue) qObject;

                //TODO: add deviations and usage percentage
                objStats.put(StatsFields.NAME, queue.getName());
                objStats.put(StatsFields.TYPE, queue.getType());

                objStats.put(StatsFields.AVG_QUEUE_SIZE, queue.getStats().getSizesSeries().getAverage());
                objStats.put(StatsFields.AVG_WAIT_TIME, queue.getStats().getDurationSeries().getAverage());
            }

            stats.put(qObject.getId(), objStats);
        }

        return stats;
    }

    public Simulation getSim() {
        return sim;
    }

    public Random getRandom() {
        return random;
    }

    public Consumer<Double> getProgressCallback() {
        return progressCallback;
    }

    public void setProgressCallback(Consumer<Double> progressCallback) {
        this.progressCallback = progressCallback;
        sim.setTimeChangedCallback(this::onTimeChanged);
    }
    
    private void onTimeChanged(Integer time) {
        Double newProgress = ((double) time) / duration;

        // notify each 1%
        if (newProgress - progress > 0.01) {
            progress = newProgress;
            
            if (progressCallback != null)
                progressCallback.accept(newProgress);
        }            
    }

    public double getProgress() {
        return progress;
    }
}