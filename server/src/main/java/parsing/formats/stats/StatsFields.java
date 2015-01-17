package parsing.formats.stats;

// why not enum?
// because it requires tu call toString() each time explicitly
public class StatsFields {
    public static final String USE_COUNT = "useCount";

    public static final String AVG_QUEUE_SIZE = "avgQueueSize";
    public static final String AVG_WAIT_TIME = "avgWaitTime";
}
