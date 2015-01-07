package core.resources;

import core.Event;
import core.Simulation;

import java.util.ArrayDeque;
import java.util.Queue;

public class Facility {
    private Queue<Event> queue = new ArrayDeque<>();

    private Simulation sim;
    private int channels = 1;
    private int freeChannels = 1;

    public Facility(Simulation sim, int channels) {
        this.sim = sim;
        this.channels = channels;
        this.freeChannels = channels;
    }

    public void use(int useTime) {
        use(1, useTime);
    }

    public Event use(int channels, int useTime) {
        if (freeChannels >= channels) {
            // handle (wait and fire)

        } else {
            // enqueue
        }

        return new Event(this.sim);
    }

    public int getChannels() {
        return channels;
    }

    public int getFreeChannels() {
        return freeChannels;
    }
}
