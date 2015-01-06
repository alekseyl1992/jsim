package core;


import java.util.*;

public class Simulation {
    private int time = 0;
    private int endTime = Integer.MAX_VALUE;

    public enum State {
        ACTIVE, STOPPED
    }

    private State state;

    private List<Process> processes = new ArrayList<>();

    private Queue<TimeEvent> delayedEvents
            = new PriorityQueue<>((a, b) -> Integer.compare(a.getTime(), b.getTime()));

    private Queue<Event> firedEvents = new LinkedList<>();

    public Simulation(int endTime) {
        this.endTime = endTime;
    }

    public void start() {
        this.state = State.ACTIVE;

        // run processes, created before simulation began
        for (Process p: processes)
            p.start();

        processes.clear();

        // main simulation loop
        while (!firedEvents.isEmpty() || !delayedEvents.isEmpty()) {
            while (!firedEvents.isEmpty()) {
                Event e = firedEvents.poll();
                e.execute();
            }

            // no events to execute, it's time to advance time
            if (delayedEvents.isEmpty())
                return;

            TimeEvent firstEvent = delayedEvents.poll();
            this.time = firstEvent.getTime();

            if (this.time > endTime)
                return;

            // and fire all the events with time == this.time
            firstEvent.fire();

            for (TimeEvent e = delayedEvents.peek();
                 e != null && e.getTime() == this.time;
                 e = delayedEvents.peek()) {
                delayedEvents.remove();
                e.fire();
            }
        }
    }

    public void addProcess(Process process) {
        if (state == State.ACTIVE)
            process.start();
        else
            processes.add(process);
    }

    public int getTime() {
        return time;
    }

    public State getState() {
        return state;
    }

    public void delay(int timeout, Process process) {
        delayedEvents.add(new TimeEvent(this, this.time + timeout, process));
    }

    public void waitEvent(Event e, Process process) {
        e.addListener(process);
    }

    public void fireEvent(Event e) {
        firedEvents.add(e);
    }
}
