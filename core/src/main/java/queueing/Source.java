package queueing;

import core.Event;
import core.Process;
import core.Simulation;

public class Source extends QObject {
    public Source(Simulation sim, double lambda) {
        super(sim);

        Process process = new Process() {
            @Override
            public void start(Event startEvent) {
                //TODO: add some randomness
                int duration = (int)(1.0 / lambda);

                getTo().use();

                sim.delay(duration, this);
            }
        };

        sim.addProcess(process);
    }
}
