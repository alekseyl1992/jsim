package core;

import java.util.ArrayDeque;
import java.util.Queue;

public class Event {
    Simulation sim = null;
    String name = "";

    private Queue<Process> listeners = new ArrayDeque<>();

    public Event(Simulation sim) {
        this.sim = sim;
    }

    public Event(Simulation sim, String name) {
        this.sim = sim;
        this.name = name;
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
}
