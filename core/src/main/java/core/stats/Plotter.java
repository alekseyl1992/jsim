package core.stats;

import org.json.JSONArray;

public class Plotter {
    public static final int DEFAULT_BUCKETS_COUNT = 10;

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
        for (int i = 0; i < nBuckets; ++i)
            this.data[i] = new AveragedValue();
    }

    public void record(int time, int value) {
        int id = (time - min) / bucketSize;
        data[id].update(value);
    }

    public AveragedValue[] getData() {
        return data;
    }

    public JSONArray getJSONData() {
        JSONArray json = new JSONArray();

        for (int i = 0; i < data.length; ++i) {
            AveragedValue value = data[i];

            JSONArray pair = new JSONArray();
            pair.put(min + i * bucketSize);
            pair.put(value.getAverage());

            json.put(pair);
        }

        return json;
    }
}
