package core;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Simulation {
    private int time = 0;
    private Random random;
    private List<Process> processes = new ArrayList<>();

    public Simulation() {
        random = new Random();
    }

    public Simulation(long seed) {
        random = new Random(seed);
    }

    public void start() {
        for (Process p: processes)
            p.start();
    }

    public void addProcess(Process process) {
        processes.add(process);
    }
}
