package messaging.services;

import messaging.Subscriber;

public interface IFrontendService extends Subscriber, Runnable {
    void setId(String sessionId, Long userId);

    void setError(String sessionId);

    String getIndexLocation();
}
