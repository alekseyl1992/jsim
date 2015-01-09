package models.resources;

import core.Event;
import core.Process;
import core.Simulation;
import core.resources.Container;

public class BufferModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation(200);

        Container container = new Container(sim, 10, 10);

        Process producer = new Process() {
            @Override
            public void start(Event startEvent) {
                container.put(this, 1)
                        .addHandler((Event e) -> {
                            log("Put 1!");
                            sim.delay(10, this);
                        });
            }
        };

        Process consumer = new Process() {
            @Override
            public void start(Event startEvent) {
                container.get(this, 5)
                        .addHandler((Event e) -> {
                            log("Got 5!");
                            sim.delay(10, this);
                        });
            }
        };

        sim.addProcess(producer);
        sim.addProcess(consumer);

        sim.start();
    }

    public static void log(String s) {
        System.out.println(s);
    }
}
