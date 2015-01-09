package core.resources;

import core.Event;

class Request {
    private Event handledEvent;

    private int channels;
    private int duration;

    public static final int NOT_SPECIFIED_DURATION = -1;

    public Request(Event handledEvent, int channels) {
        this(handledEvent, channels, NOT_SPECIFIED_DURATION);
    }

    public Request(Event handledEvent, int channels, int duration) {
        this.handledEvent = handledEvent;
        this.channels = channels;
        this.duration = duration;
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
