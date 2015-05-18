package modelling.parsing;

public class ModelParsingError extends Throwable {
    public static final String EMPTY_MODEL = "emptyModel";
    public static final String NOT_CONNECTED = "notConnected";
    public static final String UNSUPPORTED_TYPE = "unsupportedType";

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
