package core;

public abstract class IdentifiedProcess implements Process {
    private int id = -1;

    public IdentifiedProcess(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
