package core;

import java.util.ArrayDeque;
import java.util.Queue;

public class Event {
    private Simulation sim = null;
    private String name = "";

    private int timeCreated = 0;
    private int timeScheduled = 0;

    private Queue<Process> handlers = new ArrayDeque<>();

    public Event(Simulation sim) {
        this.sim = sim;
        this.timeCreated = sim.getSimTime();
    }

    public Event(Simulation sim, String name) {
        this(sim, name, 0);
    }

    public Event(Simulation sim, int time) {
        this(sim, "", time);
    }

    public Event(Simulation sim, String name, int time) {
        this.sim = sim;
        this.name = name;
        this.timeCreated = sim.getSimTime();
        this.timeScheduled = time;
    }

    /**
     * Should be called only from by Simulation class instance
     */
    void execute() {
        // exec handlers
        for (Process h: handlers)
            h.start(this);

        handlers.clear();
    }

    public void fire() {
        // enqueue
        sim.fireEvent(this);
    }

    public void addHandler(Process handler) {
        handlers.add(handler);
    }

    public void removeHandler(Process handler) {
        handlers.remove(handler);
    }

    public void removeAllHandlers() {
        handlers.clear();
    }

    public String getName() {
        return name;
    }

    public int getTimeCreated() {
        return timeCreated;
    }

    public int getScheduledTime() {
        return timeScheduled;
    }
}