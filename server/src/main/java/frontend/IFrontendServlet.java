package frontend;

import messaging.Subscriber;

/**
 * Created by Алексей on 21.01.2015.
 */
public interface IFrontendServlet extends Subscriber, Runnable {
    void setId(String sessionId, Long userId);

    void setError(String sessionId);
}
