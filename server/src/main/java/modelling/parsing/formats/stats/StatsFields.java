package modelling.parsing.formats.stats;

// why not enum?
// because it requires to call toString() each time explicitly
public class StatsFields {
    public static final String USE_COUNT = "useCount";

    public static final String NAME = "name";
    public static final String TYPE = "type";
    public static final String AVG_QUEUE_SIZE = "avgQueueSize";
    public static final String DEV_QUEUE_SIZE = "devQueueSize";
    public static final String AVG_SYSTEM_TIME = "avgSystemTime";
    public static final String DEV_SYSTEM_TIME = "devSystemTime";
    public static final String AVG_QUEUE_TIME = "avgQueueTime";
    public static final String DEV_QUEUE_TIME = "devQueueTime";

    public static final String SERVER_USAGE = "serverUsage";

    public static final String QUEUE_SIZE_PLOT = "queueSizePlot";
    public static final String SYSTEM_TIME_PLOT = "systemTimePlot";
    public static final String QUEUE_TIME_PLOT = "queueTimePlot";

    public static final String REJECTED_COUNT = "rejectedCount";
    public static final String REJECTED_PERCENT = "rejectedPercent";
}
