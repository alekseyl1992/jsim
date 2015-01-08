package core.resources;

import core.Event;
import core.Process;

class Request {
    private Process source;
    private Event handledEvent;

    private int channels;
    private int duration;

    public static final int NOT_SPECIFIED_DURATION = -1;

    public Request(Process source, Event handledEvent, int channels) {
        this(source, handledEvent, channels, NOT_SPECIFIED_DURATION);
    }

    public Request(Process source, Event handledEvent, int channels, int duration) {
        this.source = source;
        this.handledEvent = handledEvent;
        this.channels = channels;
        this.duration = duration;
    }

    public Process getSource() {
        return source;
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
