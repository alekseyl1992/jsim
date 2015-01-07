package core;

import java.util.ArrayDeque;
import java.util.Queue;

public class Event {
    private Simulation sim = null;
    private String name = "";

    private int time = 0;

    private Queue<Process> listeners = new ArrayDeque<>();

    public Event(Simulation sim) {
        this.sim = sim;
    }

    public Event(Simulation sim, String name) {
        this.sim = sim;
        this.name = name;
    }

    public Event(Simulation sim, int time) {
        this.sim = sim;
        this.time = time;
    }

    public Event(Simulation sim, String name, int time) {
        this.sim = sim;
        this.name = name;
        this.time = time;
    }

    /**
     * Should be called only from by Simulation class instance
     */
    void execute() {
        // exec handlers
        for (Process p: listeners)
            p.start();

        listeners.clear();
    }

    public void fire() {
        // enqueue
        sim.fireEvent(this);
    }

    public void addListener(Process process) {
        listeners.add(process);
    }

    public void removeListener(Process process) {
        listeners.remove(process);
    }

    public void removeAllListeners() {
        listeners.clear();
    }

    public String getName() {
        return name;
    }

    public int getTime() {
        return time;
    }
}
