package queueing;

import core.Event;
import core.Simulation;
import core.resources.Resource;
import core.stats.Population;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

public class Queue extends QObject {
    private Resource res;
    private Population stats;

    private PoissonGenerator gen;

    //TODO: implement size
    public Queue(Simulation sim, int sizeLimit, int channels, double mu, Random random) {
        super(sim);

        gen = new PoissonGenerator(mu, random);
        res = new Resource(sim, channels);
        stats = new Population(sim);
    }

    @Override
    public void use() {
        super.use();

        int timeEntered = stats.enter();

        res.use(gen.nextValue()).addHandler((Event e) -> {
            stats.leave(timeEntered);
            getTo().use();
        });
    }

    public Population getStats() {
        return stats;
    }
}
