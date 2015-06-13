package modelling.queueing;

import core.Event;
import core.Handler;
import core.Simulation;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

public class Source extends QObject {
    private PoissonGenerator gen;

    public static final String TYPE = "source";

    public Source(Simulation sim, double lambda, Random random) {
        super(sim);
        type = TYPE;

        gen = new PoissonGenerator(1.0d / lambda, random);

        Handler handler = new Handler() {
            @Override
            public void start(Event startEvent) {
                use(); // for statistics

                int duration = gen.nextValue();

                getTo().use();

                sim.delay(duration, this);
            }
        };

        sim.runHandler(handler);
    }
}
