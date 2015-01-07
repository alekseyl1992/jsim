package core;


import java.util.*;

public class Simulation {
    private int simTime = 0;
    private int endTime = Integer.MAX_VALUE;

    public enum State {
        ACTIVE, STOPPED
    }

    private State state;

    private List<Process> processes = new ArrayList<>();

    private Queue<Event> eventQueue
            = new PriorityQueue<>((a, b) -> Integer.compare(a.getTime(), b.getTime()));

    public Simulation() {

    }

    public Simulation(int endTime) {
        this.endTime = endTime;
    }

    public void start() {
        if (this.state == State.ACTIVE)
            throw new SimulationError("Unable to start one simulation multiple times");

        this.state = State.ACTIVE;

        // run processes, created before simulation began
        for (Process p: processes)
            p.start();

        processes.clear();

        // main simulation loop
        while (!eventQueue.isEmpty()) {
            Event e = eventQueue.poll();

            if (e.getTime() >= this.endTime)
                return;  // out of simulation time

            this.simTime = e.getTime();
            e.execute();
        }
    }

    public void addProcess(Process process) {
        if (state == State.ACTIVE)
            process.start();
        else
            processes.add(process);
    }

    public int getSimTime() {
        return simTime;
    }

    public State getState() {
        return state;
    }

    public void delay(int timeout, Process process) {
        Event e = new Event(this, this.simTime + timeout);
        e.addListener(process);

        eventQueue.add(e);
    }

    public void waitEvent(Event e, Process process) {
        e.addListener(process);
    }

    public void fireEvent(Event e) {
        eventQueue.add(e);
    }
}
