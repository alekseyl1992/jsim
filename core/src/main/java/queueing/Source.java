package queueing;

import core.Event;
import core.Process;
import core.Simulation;
import org.uncommons.maths.random.PoissonGenerator;

import java.util.Random;

public class Source extends QObject {
    private PoissonGenerator gen;

    public Source(Simulation sim, double lambda, Random random) {
        super(sim);
        type = "source";

        gen = new PoissonGenerator(1.0d / lambda, random);

        Process process = new Process() {
            @Override
            public void start(Event startEvent) {
                use(); // for statistics

                int duration = gen.nextValue();

                getTo().use();

                sim.delay(duration, this);
            }
        };

        sim.addProcess(process);
    }
}
