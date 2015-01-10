package parsing.enums;

public enum QObjectFields {
    TYPE("type"),
    NAME("name"),
    ID("id"),
    X("x"),
    Y("y"),
    SPEC("spec"),
    TO("to"),
    TO_A("toA"),
    TO_B("toB"),
    P_A("pA");

    private String name;

    private QObjectFields(String name) {
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
