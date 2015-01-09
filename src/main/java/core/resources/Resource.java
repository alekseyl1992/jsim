package core.resources;

import core.Event;
import core.Simulation;

import java.util.ArrayDeque;
import java.util.Queue;

public class Resource {
    private Queue<Request> queue = new ArrayDeque<>();

    private Simulation sim;
    private int channels = 1;
    private int freeChannels = 1;

    public Resource(Simulation sim, int channels) {
        this.sim = sim;
        this.channels = channels;
        this.freeChannels = channels;
    }

    public void use(int duration) {
        use(1, duration);
    }

    //TODO: release?..

    public Event use(int channels, int duration) {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handleQueue);

        Request r = new Request(handledEvent, channels, duration);

        if (!queue.isEmpty() || !handleRequest(r))
            queue.add(r);

        return handledEvent;
    }

    private void handleQueue(Event e) {
        while (handleRequest(queue.peek()))
            queue.remove();
    }

    private boolean handleRequest(Request r) {
        if (r == null)
            return false;

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
