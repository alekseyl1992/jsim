package models;

import core.Simulation;

public class TestModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation(1234);

        sim.addProcess(() -> System.out.println("test"));

        sim.start();
    }
}
