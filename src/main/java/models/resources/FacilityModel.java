package models.resources;

import core.Simulation;
import core.Process;
import core.resources.Facility;

public class FacilityModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Facility f = new Facility(sim, 4);

        Process client = new Process() {
            @Override
            public void start() {
                int nextClientTime = 10;
                sim.delay(nextClientTime, this::use);
            }

            public void use() {
                int useTime = 2;
                f.use(1, useTime).addListener(() -> System.out.println("Used"));
            }
        };
        sim.addProcess(client);

        sim.start();
    }
}
