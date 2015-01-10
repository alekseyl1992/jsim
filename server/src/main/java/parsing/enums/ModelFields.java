package parsing.enums;

public enum ModelFields {
    OBJECTS("objects"),
    DURATION("duration");

    private String name;

    private ModelFields(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name;
    }
}
