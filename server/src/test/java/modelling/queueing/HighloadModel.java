package modelling.queueing;

import core.Simulation;
import core.stats.Population;
import org.uncommons.maths.random.MersenneTwisterRNG;

import java.util.Random;

public class HighloadModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Random random = new MersenneTwisterRNG();

        Source source1 = new Source(sim, 100, random);
        Source source2 = new Source(sim, 100, random);
        Source source3 = new Source(sim, 100, random);

        Queue queue = new Queue(sim, -1, 1, 1, random);
        Sink sink = new Sink(sim);

        source1.connectTo(queue);
        source2.connectTo(queue);
        source3.connectTo(queue);

        queue.connectTo(sink);

        sim.start(8 * 60 * 60);

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
