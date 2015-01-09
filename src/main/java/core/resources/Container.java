package core.resources;

import core.Event;
import core.Simulation;
import core.Process;

import java.util.ArrayDeque;
import java.util.Queue;

public class Container {
    private Simulation sim;

    private int capacity;
    private int size;

    private Queue<Request> putQueue = new ArrayDeque<>();
    private Queue<Request> getQueue = new ArrayDeque<>();

    public Container(Simulation sim, int capacity) {
        this(sim, capacity, 0);
    }

    public Container(Simulation sim, int capacity, int initialSize) {
        this.sim = sim;

        this.capacity = capacity;
        this.size = initialSize;
    }

    public Event get(Process source, int count) {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handlePutQueue);

        Request r = new Request(source, handledEvent, count);

        if (!getQueue.isEmpty() || !handleGetRequest(r))
            getQueue.add(r);

        return handledEvent;
    }

    public Event put(Process source, int count) {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handleGetQueue);

        Request r = new Request(source, handledEvent, count);

        if (!putQueue.isEmpty() || !handlePutRequest(r))
            putQueue.add(r);

        return handledEvent;
    }

    private boolean handlePutRequest(Request r) {
        if (r == null)
            return false;

        if (r.getChannels() <= capacity - size) {
            size += r.getChannels();
            r.getHandledEvent().fire();

            return true;
        } else {
            return false;
        }
    }

    private void handlePutQueue(Event e) {
        while (handlePutRequest(putQueue.peek()))
            putQueue.remove();
    }

    private boolean handleGetRequest(Request r) {
        if (r == null)
            return false;

        if (r.getChannels() <= size) {
            size -= r.getChannels();
            r.getHandledEvent().fire();

            return true;
        } else {
            return false;
        }
    }

    private void handleGetQueue(Event e) {
        while (handleGetRequest(getQueue.peek()))
            getQueue.remove();
    }
}
