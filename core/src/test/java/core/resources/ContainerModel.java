package core.resources;

import core.Event;
import core.Handler;
import core.Simulation;

public class ContainerModel {
    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Container container = new Container(sim, 10, 10);

        Handler producer = new Handler() {
            @Override
            public void start(Event startEvent) {
                container.put(1)
                        .addHandler((Event e) -> {
                            log("Put 1!");
                            sim.delay(10, this);
                        });
            }
        };

        Handler consumer = new Handler() {
            @Override
            public void start(Event startEvent) {
                container.get(5)
                        .addHandler((Event e) -> {
                            log("Got 5!");
                            sim.delay(10, this);
                        });
            }
        };

        sim.runHandler(producer);
        sim.runHandler(consumer);

        sim.start(200);
    }

    public static void log(String s) {
        System.out.println(s);
    }
}
