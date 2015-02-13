package modelling.queueing;

//TODO: rethink about Runtime
public class QueueingError extends RuntimeException {
    public QueueingError(String message) {
        super(message);
    }
}
