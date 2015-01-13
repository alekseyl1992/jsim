package core.stats;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;

public class DataSeriesTest {
    private class Data {
        public int value;
        public double w;

        public Data(int value, double w) {
            this.value = value;
            this.w = w;
        }
    }

    private ArrayList<Data> data;
    private DataSeries ds;

    @Before
    public void setUp() throws Exception {
        data = new ArrayList<>();
        ds = new DataSeries();

        for (int i = 0; i < 10; ++i) {
            Data d = new Data((i + 1) * 10, i + 1);
            data.add(d);
            ds.record(d.value, d.w);
        }
    }

    @Test
    public void testGetMin() throws Exception {
        int min = data.stream()
                .min((Data a, Data b) -> Integer.compare(a.value, b.value))
                .get().value;

        assert ds.getMin() == min;
    }

    @Test
    public void testGetMax() throws Exception {
        int max = data.stream()
                .max((Data a, Data b) -> Integer.compare(a.value, b.value))
                .get().value;

        assert ds.getMax() == max;
    }

    @Test
    public void testGetRange() throws Exception {
        assert ds.getMax() - ds.getMin() == ds.getRange();
    }

    @Test
    public void testGetSum() throws Exception {
        int sum = data.stream()
                .reduce((Data a, Data b) -> new Data(a.value + b.value, a.w + b.w))
                .get().value;

        assert ds.getSum() == sum;
    }

    @Test
    public void testGetSumWeighted() throws Exception {
        double sumWeighted = data.stream()
                .map((Data d) -> d.w * d.value)
                .reduce((Double a, Double b) -> a + b)
                .get();

        assert ds.getSumWeighted() == sumWeighted;
    }

    @Test
    public void testGetAverage() throws Exception {
        double sumWeighted = data.stream()
                .map((Data d) -> d.w * d.value)
                .reduce((Double a, Double b) -> a + b)
                .get();

        double weightsSum = data.stream()
                .map((Data d) -> d.w)
                .reduce((Double a, Double b) -> a + b)
                .get();

        assert ds.getAverage() == sumWeighted / weightsSum;
    }

    @Test
    public void testGetVariance() throws Exception {
        double variance = calcVariance();

        assert almostEqual(ds.getVariance(), variance);
    }

    @Test
    public void testGetDeviation() throws Exception {
        double deviation = Math.sqrt(calcVariance());

        assert almostEqual(ds.getDeviation(), deviation);
    }

    private double calcVariance() {
        double squaresSum = data.stream()
                .map((Data d) -> d.w * Math.pow(d.value, 2))
                .reduce((Double a, Double b) -> a + b)
                .get();

        double sumWeighted = data.stream()
                .map((Data d) -> d.w * d.value)
                .reduce((Double a, Double b) -> a + b)
                .get();

        double weightsSum = data.stream()
                .map((Data d) -> d.w)
                .reduce((Double a, Double b) -> a + b)
                .get();

        double variance = (squaresSum - Math.pow(sumWeighted, 2) / weightsSum) / weightsSum;

        return variance;
    }

    @Test
    public void testGetCount() throws Exception {
        assert ds.getCount() == data.size();
    }

    private boolean almostEqual(double a, double b) {
        return a == b || Math.abs(a - b) < 0.00001;
    }
}