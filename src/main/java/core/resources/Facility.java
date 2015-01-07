package core.resources;

import core.Event;
import core.Process;
import core.Simulation;

import java.util.ArrayDeque;
import java.util.Queue;

public class Facility {
    private Queue<Request> queue = new ArrayDeque<>();

    private Simulation sim;
    private int channels = 1;
    private int freeChannels = 1;

    public Facility(Simulation sim, int channels) {
        this.sim = sim;
        this.channels = channels;
        this.freeChannels = channels;
    }

    public void use(Process source, int duration) {
        use(source, 1, duration);
    }

    public Event use(Process source, int channels, int duration) {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handleQueue);

        Request r = new Request(source, handledEvent, channels, duration);

        if (!handleRequest(r))
            queue.add(r);

        return handledEvent;
    }

    private void handleQueue(Event e) {
        if (queue.isEmpty())
            return;

        while (handleRequest(queue.peek()))
            queue.remove();
    }

    private boolean handleRequest(Request r) {
        if (freeChannels >= r.getChannels()) {
            // handle (wait and fire)
            freeChannels -= r.getChannels();
            sim.delay(r.getDuration(), (Event e) -> {
                freeChannels += r.getChannels();
                r.getHandledEvent().fire();
            });

            return true;
        }

        return false;
    }

    public int getChannels() {
        return channels;
    }

    public int getFreeChannels() {
        return freeChannels;
    }
}
