package core.resources;

import core.Event;
import core.Handler;
import core.Simulation;

public class StorageModel {

    public static void main(String[] args) {
        Simulation sim = new Simulation();

        Storage<Point> storage = new Storage<>(sim, 10);

        Handler producer = new Handler() {
            private int x = 0;
            private int y = 0;

            @Override
            public void start(Event startEvent) {
                Point point = new Point(x++, y++);

                storage.put(point)
                        .addHandler((Event e) -> {
                            log("Put: " + point);
                            sim.delay(10, this);
                        });
            }
        };

        Handler consumer = new Handler() {
            @Override
            public void start(Event startEvent) {
                storage.get()
                        .addHandler((Event e) -> {
                            Point point = (Point) e.getData();

                            log("Get: " + point);
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

class Point {
    private int x;
    private int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    @Override
    public String toString() {
        return String.format("(%d; %d)", x, y);
    }
}