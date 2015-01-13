package core.stats;

import core.Simulation;

public class Population {
    private TimeSeries sizesSeries;
    private DataSeries durationSeries;

    private Simulation sim;

    public Population(Simulation sim) {
        this.sim = sim;

        sizesSeries = new TimeSeries(sim);
        durationSeries = new DataSeries();
    }

    public void enter() {

    }

    public void leave() {

    }

    public TimeSeries getSizesSeries() {
        return sizesSeries;
    }

    public DataSeries getDurationSeries() {
        return durationSeries;
    }
}
