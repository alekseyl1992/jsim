package queueing;

import core.Event;
import core.Simulation;
import core.resources.Resource;

public class Queue extends QObject {
    private Resource res;
    private int duration;

    //TODO: implement size
    public Queue(Simulation sim, int sizeLimit, int channels, double mu) {
        super(sim);

        res = new Resource(sim, channels);
        this.duration = (int)(1.0 / mu);
    }

    @Override
    public void use() {
        res.use(duration).addHandler((Event e) -> {
            getTo().use();
        });
    }
}
