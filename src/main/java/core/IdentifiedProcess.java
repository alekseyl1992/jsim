package core;

public class IdentifiedProcess implements Process {
    private int id = -1;

    public IdentifiedProcess(int id) {
        this.id = id;
    }

    @Override
    public void start() {

    }

    public int getId() {
        return id;
    }
}
