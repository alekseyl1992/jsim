package core.stats;

public class DataSeries {
    private int min = Integer.MAX_VALUE;
    private int max = Integer.MIN_VALUE;
    private int sum = 0;
    private double sumWeighted = 0;
    private double q = 0;

    private double sumOfWeights;
    private double average;
    private int count;

    public DataSeries() {

    }

    public void record(int value) {
        record(value, 1.0);
    }

    public void record(int value, double weight) {
        ++count;

        if (value < min)
            min = value;
        if (value > max)
            max = value;

        sum += value;
        sumWeighted += weight * value;

        sumOfWeights += weight;

        double oldAverage = average;

        if (sumOfWeights != 0)
            average += (weight / sumOfWeights) * (value - oldAverage);

        q += weight * (value - average) * (value - oldAverage);
    }

    public int getMin() {
        return min;
    }

    public int getMax() {
        return max;
    }

    public int getRange() {
        return max - min;
    }

    public int getSum() {
        return sum;
    }

    public double getSumWeighted() {
        return sumWeighted;
    }

    public double getAverage() {
        return average;
    }

    public double getVariance() {
        return q / sumOfWeights;
    }

    public double getDeviation() {
        return Math.sqrt(getVariance());
    }

    public int getCount() {
        return count;
    }
}
