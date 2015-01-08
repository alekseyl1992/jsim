package core.resources;

import core.Event;
import core.Simulation;
import core.Process;

import java.util.ArrayDeque;
import java.util.Queue;

public class Buffer {
    private Simulation sim;

    private int capacity;
    private int size;

    private Queue<Request> putQueue = new ArrayDeque<>();
    private Queue<Request> getQueue = new ArrayDeque<>();

    public Buffer(Simulation sim, int capacity) {
        this.sim = sim;

        this.capacity = capacity;
        this.size = 0;
    }

    public Event get(Process source, int count) {
        Event handledEvent = new Event(sim);
        Request r = new Request(source, handledEvent, count);

        getQueue.add(r);

        return handledEvent;
    }

    public Event put(Process source, int count) {
        Event handledEvent = new Event(sim);
        Request r = new Request(source, handledEvent, count);

        putQueue.add(r);

        return handledEvent;
    }
}
