package modelling.parsing;

import core.Simulation;
import modelling.parsing.formats.stats.StatsFields;
import modelling.queueing.QObject;
import modelling.queueing.Queue;
import modelling.queueing.Sink;
import modelling.queueing.Splitter;
import org.json.JSONObject;
import org.uncommons.maths.random.MersenneTwisterRNG;

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

            objStats.put(StatsFields.NAME, qObject.getName());
            objStats.put(StatsFields.TYPE, qObject.getType());

            objStats.put(StatsFields.USE_COUNT, qObject.getUseCount());

            if (qObject instanceof Queue) {
                Queue queue = (Queue) qObject;

                objStats.put(StatsFields.AVG_QUEUE_SIZE, queue.getQueuePopulation().getSizesSeries().getAverage());
                objStats.put(StatsFields.DEV_QUEUE_SIZE, queue.getQueuePopulation().getSizesSeries().getDeviation());
                objStats.put(StatsFields.AVG_QUEUE_TIME, queue.getQueuePopulation().getDurationSeries().getAverage());
                objStats.put(StatsFields.DEV_QUEUE_TIME, queue.getQueuePopulation().getDurationSeries().getDeviation());
                objStats.put(StatsFields.AVG_SYSTEM_TIME, queue.getSystemPopulation().getDurationSeries().getAverage());
                objStats.put(StatsFields.DEV_SYSTEM_TIME, queue.getSystemPopulation().getDurationSeries().getDeviation());

                objStats.put(StatsFields.SERVER_USAGE, queue.getServerUsage());

                objStats.put(StatsFields.QUEUE_SIZE_PLOT, queue.getSizePlotter().getJSONData());
                objStats.put(StatsFields.QUEUE_TIME_PLOT, queue.getQueueTimePlotter().getJSONData());
                objStats.put(StatsFields.SYSTEM_TIME_PLOT, queue.getSystemTimePlotter().getJSONData());

                objStats.put(StatsFields.REJECTED_COUNT, queue.getRejectedCount());

                double rejectedPercent = 0;
                // prevent division by zero
                if (queue.getUseCount() != 0) {
                    rejectedPercent = ((double) queue.getRejectedCount()) / queue.getUseCount();
                }
                objStats.put(StatsFields.REJECTED_PERCENT, rejectedPercent);
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

    public int getDuration() {
        return duration;
    }

    public void validate() throws ModelParsingError {
        // empty check
        if (objects.isEmpty())
            throw new ModelParsingError("Model is empty");

        // splitters check
        for (QObject obj: objects.values()) {
            if (obj instanceof Splitter) {
                Splitter s = (Splitter) obj;

                if (s.getToA() == null || s.getToB() == null)
                    throw new ModelParsingError("Both outputs of Splitter should be connected somewhere");
            } else if (!(obj instanceof Sink)) {
                if (obj.getTo() == null)
                    throw new ModelParsingError("All outputs should be connected somewhere");
            }
        }
    }
}