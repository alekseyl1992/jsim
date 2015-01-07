package core;


import java.util.*;

public class Simulation {
    private int simTime = 0;
    private int endTime = Integer.MAX_VALUE;

    public enum State {
        ACTIVE, STOPPED
    }

    private State state;

    private Queue<Event> eventQueue
            = new PriorityQueue<>((a, b) -> Integer.compare(a.getScheduledTime(), b.getScheduledTime()));

    public Simulation() {
        this(Integer.MAX_VALUE);
    }

    public Simulation(int endTime) {
        this.endTime = endTime;

        eventQueue.add(new Event(this, "Start event", 0));
    }

    public void start() {
        if (this.state == State.ACTIVE)
            throw new SimulationError("Unable to start one simulation multiple times");

        this.state = State.ACTIVE;

        // main simulation loop
        while (!eventQueue.isEmpty()) {
            Event e = eventQueue.poll();

            if (e.getScheduledTime() >= this.endTime)
                return;  // out of simulation time

            this.simTime = e.getScheduledTime();
            e.execute();
        }
    }

    public void addProcess(Process process) {
        if (state == State.ACTIVE)
            process.start(null);
        else
            eventQueue.peek().addHandler(process);
    }

    public int getSimTime() {
        return simTime;
    }

    public State getState() {
        return state;
    }

    public void delay(int timeout, Process process) {
        Event e = new Event(this, this.simTime + timeout);
        e.addHandler(process);

        eventQueue.add(e);
    }

    public void waitEvent(Event e, Process process) {
        e.addHandler(process);
    }

    public void fireEvent(Event e) {
        eventQueue.add(e);
    }
}
