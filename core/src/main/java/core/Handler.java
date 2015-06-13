package core;

@FunctionalInterface
public interface Handler {
    public void start(Event startEvent);
}

