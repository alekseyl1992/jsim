package core.stats;

import core.Simulation;

public class TimeSeries extends DataSeries {
    private Simulation sim;
    private int lastValue;
    private int lastRecordTime = -1;

    public TimeSeries(Simulation sim) {
        this.sim = sim;
    }

    @Override
    public void record(int value) {
        int time = sim.getSimTime();

        if (lastRecordTime != -1)
            super.record(lastValue, time - lastRecordTime);

        lastValue = value;
        lastRecordTime = time;
    }
}
