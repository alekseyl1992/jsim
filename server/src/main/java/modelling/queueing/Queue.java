package modelling.queueing;

import core.Event;
import core.Simulation;
import core.resources.Resource;
import core.stats.Plotter;
import core.stats.Population;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

//TODO: rename to Resource
public class Queue extends QObject {
    private Resource res;
    private Population stats;

    private Plotter sizePlotter;
    private Plotter timePlotter;

    private PoissonGenerator gen;

    public static final String TYPE = "queue";

    //TODO: implement size
    public Queue(Simulation sim, int sizeLimit, int channels, double mu, Random random) {
        super(sim);
        type = TYPE;

        gen = new PoissonGenerator(1.0d / mu, random);
        res = new Resource(sim, channels);
        stats = new Population(sim);
    }

    @Override
    public void use() {
        super.use();

        int timeEntered = stats.enter();

        if (sizePlotter != null)
            sizePlotter.record(timeEntered, res.getQueueSize());

        res.use(gen.nextValue()).addHandler((Event e) -> {
            stats.leave(timeEntered);

            if (timePlotter != null) {
                int currentTime = sim.getSimTime();
                timePlotter.record(currentTime, currentTime - timeEntered);
            }

            getTo().use();
        });
    }

    public Population getStats() {
        return stats;
    }

    public Plotter getSizePlotter() {
        return sizePlotter;
    }

    public void setSizePlotter(Plotter sizePlotter) {
        this.sizePlotter = sizePlotter;
    }

    public Plotter getTimePlotter() {
        return timePlotter;
    }

    public void setTimePlotter(Plotter timePlotter) {
        this.timePlotter = timePlotter;
    }
}
