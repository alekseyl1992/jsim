package modelling.parsing;

public class ModelParsingError extends Throwable {
    public ModelParsingError(String message, Throwable reason) {
        super(message, reason);
    }

    public ModelParsingError(String message) {
        super(message);
    }

    public ModelParsingError(Throwable reason) {
        super(reason);
    }
}
