package core;

public class SimulationError extends RuntimeException {
    public SimulationError(String message) {
        super(message);
    }

    public SimulationError(String message, Throwable reason) {
        super(message, reason);
    }
}
