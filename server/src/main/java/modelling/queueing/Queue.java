package modelling.queueing;

import core.Event;
import core.Simulation;
import core.resources.Resource;
import core.resources.Request;
import core.stats.Plotter;
import core.stats.Population;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

//TODO: rename to Resource
public class Queue extends QObject {
    private Resource res;
    private Population queuePopulation;
    private Population systemPopulation;

    private Plotter sizePlotter;
    private Plotter systemTimePlotter;
    private Plotter queueTimePlotter;

    private int sizeLimit;
    private int rejectedCount = 0;

    private PoissonGenerator gen;

    public static final String TYPE = "queue";
    private int serverUsage;

    //TODO: implement size
    public Queue(Simulation sim, int sizeLimit, int channels, double mu, Random random) {
        super(sim);
        type = TYPE;

        gen = new PoissonGenerator(1.0d / mu, random);
        res = new Resource(sim, channels);
        queuePopulation = new Population(sim);
        systemPopulation = new Population(sim);

        this.sizeLimit = sizeLimit;
    }

    @Override
    public void use() {
        super.use();

        // if we are out of queue size limit
        if (sizeLimit != -1 && res.getQueueSize() >= sizeLimit) {
            ++rejectedCount;
            return;
        }

        int timeEntered = queuePopulation.enter();
        systemPopulation.enter();

        if (sizePlotter != null)
            sizePlotter.record(timeEntered, res.getQueueSize());

        Request r = res.use(gen.nextValue());
        r.getHandlingEvent()
                .addHandler((Event e) -> {
                    queuePopulation.leave(timeEntered);

                    if (queueTimePlotter != null) {
                        int currentTime = sim.getSimTime();
                        queueTimePlotter.record(currentTime, currentTime - timeEntered);
                    }
                });

        r.getHandledEvent()
                .addHandler((Event e) -> {
                    systemPopulation.leave(timeEntered);

                    if (systemTimePlotter != null) {
                        int currentTime = sim.getSimTime();
                        systemTimePlotter.record(currentTime, currentTime - timeEntered);
                        serverUsage += r.getDuration();
                    }

                    getTo().use();
                });
    }

    public Population getQueuePopulation() {
        return queuePopulation;
    }

    public Plotter getSizePlotter() {
        return sizePlotter;
    }

    public void setSizePlotter(Plotter sizePlotter) {
        this.sizePlotter = sizePlotter;
    }

    public Plotter getSystemTimePlotter() {
        return systemTimePlotter;
    }

    public void setSystemTimePlotter(Plotter systemTimePlotter) {
        this.systemTimePlotter = systemTimePlotter;
    }

    public int getRejectedCount() {
        return rejectedCount;
    }

    public Plotter getQueueTimePlotter() {
        return queueTimePlotter;
    }

    public void setQueueTimePlotter(Plotter queueTimePlotter) {
        this.queueTimePlotter = queueTimePlotter;
    }

    public Population getSystemPopulation() {
        return systemPopulation;
    }

    public double getServerUsage() {
        return ((double) serverUsage)
                / res.getChannels()
                / sim.getSimTime();
    }
}
