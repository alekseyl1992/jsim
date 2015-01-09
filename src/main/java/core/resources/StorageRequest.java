package core.resources;

import core.Event;

public class StorageRequest<T> {
    private T data;
    private Event handledEvent;

    public StorageRequest(T data, Event handledEvent) {
        this.data = data;
        this.handledEvent = handledEvent;
    }

    public T getData() {
        return data;
    }

    public Event getHandledEvent() {
        return handledEvent;
    }
}
