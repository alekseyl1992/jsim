package modelling.queueing;

import core.Simulation;
import core.stats.Population;
import org.uncommons.maths.random.MersenneTwisterRNG;

import java.util.Random;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Random random = new MersenneTwisterRNG();

        Source source = new Source(sim, 1, random);
        Queue queue = new Queue(sim, -1, 1, 1, random);
        Splitter splitter = new Splitter(sim, 0.5, random);
        Sink sink = new Sink(sim);

        source.connectTo(queue);
        queue.connectTo(splitter);
        splitter.connectTo(sink, queue);

        sim.start(1000);

        Population stats = queue.getStats();
        log("t_avg_mean = ", stats.getDurationSeries().getAverage());
        log("t_avg_dev = ", stats.getDurationSeries().getDeviation());

        log("l_avg_mean = ", stats.getSizesSeries().getAverage());
        log("l_avg_dev = ", stats.getSizesSeries().getDeviation());
    }

    public static void log(Object... args) {
        for (Object o: args)
            System.out.print(o);

        System.out.println();
    }
}
