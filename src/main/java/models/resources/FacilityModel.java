package models.resources;

import core.Event;
import core.Process;
import core.Simulation;
import core.resources.Facility;

public class FacilityModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Facility f = new Facility(sim, 4);

        Process client = new Process() {
            @Override
            public void start(Event e) {
                int nextClientTime = 10;
                sim.delay(nextClientTime, this::use);
            }

            public void use(Event e) {
                int useTime = 2;

                f.use(1, useTime)
                        .addHandler((Event event) ->
                                System.out.println(String.format("Waited %d seconds", sim.getSimTime() - event.getTimeCreated())));
            }
        };
        sim.addProcess(client);

        sim.start();
    }
}
