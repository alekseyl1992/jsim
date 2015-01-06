package models;

import core.Event;
import core.IdentifiedProcess;
import core.Process;
import core.Simulation;

public class TrafficModel {
    private static boolean direction = false;

    private static int manId = 0;
    private static int carId = 0;

    public static void main(String[] args) {
        Simulation sim = new Simulation(1000);

        Event peopleEvent = new Event(sim, "People can cross");
        Event carsEvent = new Event(sim, "Cars can cross");

        // create direction process
        Process directionProcess = new Process() {
            @Override
            public void start() {
                direction = !direction;

                if (direction) {
                    System.out.println("Direction changed: people");
                    peopleEvent.fire();
                } else {
                    System.out.println("Direction changed: cars");
                    carsEvent.fire();
                }

                // change direction each 30 seconds
                sim.delay(30, this);
            }
        };
        sim.addProcess(directionProcess);

        // people generator
        Process peopleGenerator = new Process() {
            @Override
            public void start() {
                Process man = new IdentifiedProcess(manId++) {
                    @Override
                    public void start() {
                        sim.waitEvent(peopleEvent, this::cross);
                    }

                    public void cross() {
                        System.out.println("Man " + Integer.toString(getId()) + " is crossing");
                    }
                };

                sim.addProcess(man);

                // generate new man each 60 seconds
                sim.delay(60, this);
            }
        };

        sim.addProcess(peopleGenerator);

        // cars generator
        Process carsGenerator = new Process() {
            @Override
            public void start() {
                Process car = new IdentifiedProcess(carId++) {
                    @Override
                    public void start() {
                        sim.waitEvent(carsEvent, this::cross);
                    }

                    public void cross() {
                        System.out.println("Car " + Integer.toString(getId()) + " is crossing");
                    }
                };

                sim.addProcess(car);

                // generate new car each 20 seconds
                sim.delay(2, this);
            }
        };
        sim.addProcess(carsGenerator);

        // start simulation
        sim.start();
    }
}
