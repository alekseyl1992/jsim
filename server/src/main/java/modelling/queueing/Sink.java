package modelling.queueing;

import core.Simulation;

public class Sink extends QObject {
    public static final String TYPE = "sink";

    public Sink(Simulation sim) {
        super(sim);
        type = TYPE;
    }

    @Override
    public void use() {
        super.use();
    }
}
