package queueing;

import core.Simulation;
import org.uncommons.maths.random.MersenneTwisterRNG;

import java.util.Random;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Random random = new MersenneTwisterRNG();

        QObject source = new Source(sim, 1, random);
        QObject queue = new Queue(sim, -1, 1, 1, random);
        QObject splitter = new Splitter(sim, 0.5, random);
        QObject sink = new Sink(sim);

        source.connectTo(queue);
        queue.connectTo(splitter);
        splitter.connectTo(sink, queue);

        sim.start(10);
    }
}
