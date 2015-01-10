package parsing.enums;

public enum Type {
    SOURCE("source"),
    QUEUE("queue"),
    SPLITTER("splitter"),
    SINK("sink");

    private String type;

    private Type(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return type;
    }

    public static Type fromString(String type) {
        if (type == null)
            return null;

        for (Type t: Type.values())
            if (t.type.equals(type))
                return t;

        return null;
    }
}
