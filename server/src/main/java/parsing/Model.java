package parsing;

import core.Simulation;
import org.uncommons.maths.random.MersenneTwisterRNG;
import queueing.QObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class Model {
    private Simulation sim;
    private Random random;

    private Map<String, QObject> objects = new HashMap<>();

    public Model() {
        sim = new Simulation();
        random = new MersenneTwisterRNG();
    }

    public Model(byte[] seed) {
        sim = new Simulation();
        random = new MersenneTwisterRNG(seed);
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

    public void startSimulation(int duration) {
        sim.start(duration);
    }

    public Simulation getSim() {
        return sim;
    }

    public Random getRandom() {
        return random;
    }
}