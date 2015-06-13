package core;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Handler handler = new Handler() {
            @Override
            public void start(Event e) {
                System.out.println(sim.getSimTime());
                sim.delay(100, this);
            }
        };

        sim.runHandler(handler);

        sim.start(1000);
    }
}
