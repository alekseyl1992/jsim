package queueing;

import core.Simulation;

import java.util.Random;

public class Splitter extends QObject {
    private double pA;
    private Random random;

    public Splitter(Simulation sim, double pA, Random random) {
        super(sim);
        this.pA = pA;

        this.random = random;
    }

    @Override
    public void use() {
        super.use();

        if (random.nextDouble() < pA)
            getToA().use();
        else
            getToB().use();
    }
}