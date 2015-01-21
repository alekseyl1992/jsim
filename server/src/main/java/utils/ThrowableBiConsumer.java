package utils;

@FunctionalInterface
public interface ThrowableBiConsumer<T, U> {
    public void accept(T t, U u) throws Exception;
}
