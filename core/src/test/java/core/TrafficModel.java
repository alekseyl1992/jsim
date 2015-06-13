package core;

public class TrafficModel {
    private static boolean direction = false;

    private static int manId = 0;
    private static int carId = 0;

    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Event peopleEvent = new Event(sim, "People can cross");
        Event carsEvent = new Event(sim, "Cars can cross");

        // create direction process
        Handler directionHandler = new Handler() {
            @Override
            public void start(Event startEvent) {
                direction = !direction;

                if (direction) {
                    //System.out.println("Direction changed: people");
                    peopleEvent.fire();
                } else {
                    //System.out.println("Direction changed: cars");
                    carsEvent.fire();
                }

                // change direction each 30 seconds
                sim.delay(30, this);
            }
        };
        sim.runHandler(directionHandler);

        // people generator
        Handler peopleGenerator = new Handler() {
            @Override
            public void start(Event startEvent) {
                Handler man = new IdentifiedHandler(manId++) {
                    @Override
                    public void start(Event e) {
                        if (direction)
                            sim.delay(0, this::cross);
                        else
                            sim.waitEvent(peopleEvent, this::cross);
                    }

                    public void cross(Event e) {
                        //System.out.println("Man " + Integer.toString(getId()) + " is crossing");
                    }
                };

                sim.runHandler(man);

                // generate new man each 60 seconds
                sim.delay(60, this);
            }
        };

        sim.runHandler(peopleGenerator);

        // cars generator
        Handler carsGenerator = new Handler() {
            @Override
            public void start(Event startEvent) {
                Handler car = new IdentifiedHandler(carId++) {
                    @Override
                    public void start(Event startEvent) {
                        if (!direction)
                            sim.delay(0, this::cross);
                        else
                            sim.waitEvent(carsEvent, this::cross);
                    }

                    public void cross(Event crossEvent) {
                        //System.out.println("Car " + Integer.toString(getId()) + " is crossing");
                    }
                };

                sim.runHandler(car);

                // generate new car each 20 seconds
                sim.delay(20, this);
            }
        };
        sim.runHandler(carsGenerator);

        long startTime = System.currentTimeMillis();
        // start simulation
        sim.start(100000);
        System.out.println(System.currentTimeMillis() - startTime);
    }
}
