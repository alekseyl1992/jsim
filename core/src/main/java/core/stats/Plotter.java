package core.stats;

public class Plotter {
    private class AveragedValue {
        private int average = 0;
        private int count = 0;

        public void update(int value) {
            ++count;
            average += (value - average) / count;
        }

        public int getAverage() {
            return average;
        }
    }

    private AveragedValue[] data;

    private int min;
    private int max;
    private int nBuckets;
    private int bucketSize;

    public Plotter(int min, int max, int nBuckets) {
        this.min = min;
        this.max = max;
        this.nBuckets = nBuckets;
        this.bucketSize = (max - min) / nBuckets;

        this.data = new AveragedValue[nBuckets];
    }

    public void record(int time, int value) {
        int id = time / bucketSize;
        data[id].update(value);
    }

    public AveragedValue[] getData() {
        return data;
    }
}
