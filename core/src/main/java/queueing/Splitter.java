package queueing;

import core.Simulation;

import java.util.Random;

public class Splitter extends QObject {
    private double pA;
    private Random random;

    public Splitter(Simulation sim, double pA) {
        super(sim);
        this.pA = pA;

        //TODO: localize Random creation
        this.random = new Random(1234);
    }

    @Override
    public void use() {
        //TODO: use pA

        if (random.nextBoolean())
            getToA().use();
        else
            getToB().use();
    }
}
