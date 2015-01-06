package core;

import java.util.ArrayList;
import java.util.List;

public class Event {
    Simulation sim = null;
    String name = "";

    private List<Process> listeners = new ArrayList<>();

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

    public String getName() {
        return name;
    }
}
