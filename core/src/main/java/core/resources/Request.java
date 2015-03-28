package core.resources;

import core.Event;

public class Request {
    private Event handlingEvent;  // left queue, handling started
    private Event handledEvent;  // handling finished

    private int channels;
    private int duration;

    public static final int NOT_SPECIFIED_DURATION = -1;

    public Request(Event handlingEvent, Event handledEvent, int channels) {
        this(handlingEvent, handledEvent, channels, NOT_SPECIFIED_DURATION);
    }

    public Request(Event handlingEvent, Event handledEvent, int channels, int duration) {
        this.handlingEvent = handlingEvent;
        this.handledEvent = handledEvent;
        this.channels = channels;
        this.duration = duration;
    }

    public Event getHandlingEvent() {
        return handlingEvent;
    }

    public Event getHandledEvent() {
        return handledEvent;
    }

    public int getChannels() {
        return channels;
    }

    public int getDuration() {
        return duration;
    }
}
