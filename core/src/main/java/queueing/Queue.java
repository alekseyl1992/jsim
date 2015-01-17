package queueing;

import core.Event;
import core.Simulation;
import core.resources.Resource;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

public class Queue extends QObject {
    private Resource res;

    private PoissonGenerator gen;

    //TODO: implement size
    public Queue(Simulation sim, int sizeLimit, int channels, double mu, Random random) {
        super(sim);

        gen = new PoissonGenerator(mu, random);
        res = new Resource(sim, channels);
    }

    @Override
    public void use() {
        res.use(gen.nextValue())
                .addHandler((Event e) -> getTo().use());
    }
}
