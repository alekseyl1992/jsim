package parsing;

import core.Simulation;
import queueing.QObject;

import java.util.HashMap;
import java.util.Map;

public class Model {
    private Simulation sim;

    private Map<String, QObject> objects = new HashMap<>();

    public Model() {
        sim = new Simulation();
    }

    public void addQObject(QObject qObject) {
        objects.put(qObject.getId(), qObject);
    }

    public void connect(String idFrom, String idTo) {
        QObject from = objects.get(idFrom);
        QObject to = objects.get(idTo);

        from.connectTo(to);
    }

    public void connect(String idFrom, String idToA, String idToB, double pA) {
        QObject from = objects.get(idFrom);
        QObject toA = objects.get(idToA);
        QObject toB = objects.get(idToB);

        from.connectTo(toA, toB, pA);
    }

    public void startSimulation(int duration) {
        sim.start(duration);
    }

    public Simulation getSim() {
        return sim;
    }
}