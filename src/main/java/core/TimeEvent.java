package core;

public class TimeEvent extends Event {
    private int time;

    public TimeEvent(Simulation sim, int time, Process p) {
        super(sim);
        this.time = time;

        this.addListener(p);
    }

    public int getTime() {
        return time;
    }
}
