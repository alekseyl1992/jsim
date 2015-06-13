package core;

public abstract class IdentifiedHandler implements Handler {
    private int id = -1;

    public IdentifiedHandler(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
