package queueing;

import core.Simulation;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        QObject source = new Source(sim, 1);
        QObject queue = new Queue(sim, -1, 1, 1);
        QObject splitter = new Splitter(sim, 0.5);
        QObject sink = new Sink(sim);

        source.connectTo(queue);
        queue.connectTo(splitter);
        splitter.connectTo(sink, queue);

        sim.start(10);
    }
}
