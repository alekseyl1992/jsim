package core.stats;

import core.Simulation;

public class Population {
    private TimeSeries sizesSeries;
    private DataSeries durationSeries;

    private Simulation sim;

    private int population = 0;

    public Population(Simulation sim) {
        this.sim = sim;

        sizesSeries = new TimeSeries(sim);
        durationSeries = new DataSeries();
    }

    public int enter() {
        ++population;
        sizesSeries.record(population);

        return sim.getSimTime();
    }

    public void leave(int timeEntered) {
        --population;
        sizesSeries.record(population);
        durationSeries.record(sim.getSimTime() - timeEntered);
    }

    public TimeSeries getSizesSeries() {
        return sizesSeries;
    }

    public DataSeries getDurationSeries() {
        return durationSeries;
    }

    public void finish() {
        sizesSeries.finish();
    }
}
