package core.resources;

import core.Event;
import core.Process;

public class Request {
    private Process source;
    private Event handledEvent;

    private int channels;
    private int duration;

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
