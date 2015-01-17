package queueing;

import core.Simulation;

public class Sink extends QObject {
    public Sink(Simulation sim) {
        super(sim);
    }

    @Override
    public void use() {
        super.use();
        System.out.println("Something reached sink");
    }
}