package modelling.queueing;

import core.Simulation;

public class Sink extends QObject {
    public Sink(Simulation sim) {
        super(sim);
        type = "sink";
    }

    @Override
    public void use() {
        super.use();
    }
}
