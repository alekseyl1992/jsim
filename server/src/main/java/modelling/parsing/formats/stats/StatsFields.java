package modelling.parsing.formats.stats;

// why not enum?
// because it requires tu call toString() each time explicitly
public class StatsFields {
    public static final String USE_COUNT = "useCount";

    public static final String NAME = "name";
    public static final String TYPE = "type";
    public static final String AVG_QUEUE_SIZE = "avgQueueSize";
    public static final String AVG_WAIT_TIME = "avgWaitTime";

    public static final String QUEUE_SIZE_PLOT = "queueSizePlot";
    public static final String WAIT_TIME_PLOT = "waitTimePlot";
}
