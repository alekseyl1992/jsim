package utils;

import java.util.function.BiConsumer;

public class LambdaUtils {
    public static<T, U> BiConsumer<T, U> wrapToRTE(ThrowableBiConsumer<T, U> consumer) {
        return (T t, U u) -> {
            try {
                consumer.accept(t, u);
            }
            catch (RuntimeException e) {
                throw e;
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }
}
