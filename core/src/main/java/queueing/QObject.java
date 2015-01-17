package queueing;

import core.Simulation;

public abstract class QObject {
    private Simulation sim;

    private String id;

    private QObject to, toA, toB;
    private int useCount;

    public QObject(Simulation sim) {
        this.sim = sim;
    }

    public void connectTo(QObject obj) {
        to = obj;
    }

    public void connectTo(QObject first, QObject second) {
        toA = first;
        toB = second;
    }

    public String getId() {
        return id;
    }

    public QObject getTo() {
        return to;
    }

    public QObject getToA() {
        return toA;
    }

    public QObject getToB() {
        return toB;
    }

    public void use() {
        ++useCount;
    }

    public int getUseCount() {
        return useCount;
    }
}
