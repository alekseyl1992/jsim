package core.resources;

import core.Event;
import core.Process;
import core.Simulation;

public class FacilityModel {
    public static int clientId = 0;

    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Resource f = new Resource(sim, 1);

        Process client = new Process() {
            @Override
            public void start(Event e) {
                int duration = 4;

                f.use(1, duration)
                        .addHandler((Event event) -> {
                            int cid = (int) event.getData();

                            System.out.println(String.format(
                                    "Client %d waited %d seconds",
                                    cid,
                                    sim.getSimTime() - event.getTimeCreated()));
                        }).setData(clientId);

                int nextClientTime = 1;
                clientId++;
                sim.delay(nextClientTime, this);
            }
        };
        sim.addProcess(client);

        sim.start(100);

        System.out.println();
        System.out.println("Total clients created: " + clientId);
    }
}
