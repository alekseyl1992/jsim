package core.resources;

import core.Event;
import core.Simulation;

import java.util.ArrayDeque;
import java.util.Queue;

public class Storage<T> {
    private Simulation sim;

    private int capacity;

    private Queue<T> storageQueue = new ArrayDeque<>();

    private Queue<StorageRequest<T>> putQueue = new ArrayDeque<>();
    private Queue<StorageRequest<T>> getQueue = new ArrayDeque<>();

    public Storage(Simulation sim, int capacity) {
        this.sim = sim;

        this.capacity = capacity;
    }

    public Event get() {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handlePutQueue);

        StorageRequest<T> r = new StorageRequest<>(null, handledEvent);

        if (!getQueue.isEmpty() || !handleGetRequest(r))
            getQueue.add(r);

        return handledEvent;
    }

    public Event put(T data) {
        Event handledEvent = new Event(sim);
        handledEvent.addHandler(this::handleGetQueue);

        StorageRequest<T> r = new StorageRequest<T>(data, handledEvent);

        if (!putQueue.isEmpty() || !handlePutRequest(r))
            putQueue.add(r);

        return handledEvent;
    }

    private boolean handlePutRequest(StorageRequest<T> r) {
        if (r == null)
            return false;

        if (storageQueue.size() < capacity) {
            storageQueue.add(r.getData());
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

    private boolean handleGetRequest(StorageRequest<T> r) {
        if (r == null)
            return false;

        if (!storageQueue.isEmpty()) {
            T data = storageQueue.poll();
            Event e = r.getHandledEvent();
            e.setData(data);
            e.fire();

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
