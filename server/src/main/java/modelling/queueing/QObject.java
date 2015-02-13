package modelling.queueing;

import core.Simulation;

public abstract class QObject {
    protected Simulation sim;

    private String id;
    private String name;

    protected String type;

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

    public void setId(String id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }
}
