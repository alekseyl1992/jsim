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
        Process directionProcess = new Process() {
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
        sim.addProcess(directionProcess);

        // people generator
        Process peopleGenerator = new Process() {
            @Override
            public void start(Event startEvent) {
                Process man = new IdentifiedProcess(manId++) {
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

                sim.addProcess(man);

                // generate new man each 60 seconds
                sim.delay(60, this);
            }
        };

        sim.addProcess(peopleGenerator);

        // cars generator
        Process carsGenerator = new Process() {
            @Override
            public void start(Event startEvent) {
                Process car = new IdentifiedProcess(carId++) {
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

                sim.addProcess(car);

                // generate new car each 20 seconds
                sim.delay(20, this);
            }
        };
        sim.addProcess(carsGenerator);

        long startTime = System.currentTimeMillis();
        // start simulation
        sim.start(100000);
        System.out.println(System.currentTimeMillis() - startTime);
    }
}
