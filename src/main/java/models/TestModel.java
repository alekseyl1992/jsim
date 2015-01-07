package models;

import core.Process;
import core.Simulation;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation(1000);

        Process p = new Process() {
            @Override
            public void start() {
                System.out.println(sim.getSimTime());
                sim.delay(100, this);
            }
        };

        sim.addProcess(p);

        sim.start();
    }
}
