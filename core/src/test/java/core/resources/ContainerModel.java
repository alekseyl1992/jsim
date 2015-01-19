package core.resources;

import core.Event;
import core.Process;
import core.Simulation;

public class ContainerModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Container container = new Container(sim, 10, 10);

        Process producer = new Process() {
            @Override
            public void start(Event startEvent) {
                container.put(1)
                        .addHandler((Event e) -> {
                            log("Put 1!");
                            sim.delay(10, this);
                        });
            }
        };

        Process consumer = new Process() {
            @Override
            public void start(Event startEvent) {
                container.get(5)
                        .addHandler((Event e) -> {
                            log("Got 5!");
                            sim.delay(10, this);
                        });
            }
        };

        sim.addProcess(producer);
        sim.addProcess(consumer);

        sim.start(200);
    }

    public static void log(String s) {
        System.out.println(s);
    }
}
