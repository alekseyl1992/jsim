import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.MessageProperties;

import java.io.IOException;

public class StatusReporter implements Runnable {
    private static final String STATUS_QUEUE_NAME = "task_queue"; //TODO: status_queue
    
    @Override
    public void run() {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost("localhost");
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();

            channel.queueDeclare(STATUS_QUEUE_NAME, true, false, false, null);

            String message = "status";//getMessage(argv);


            channel.basicPublish("", STATUS_QUEUE_NAME,
                    MessageProperties.PERSISTENT_TEXT_PLAIN,
                    message.getBytes());

            System.out.println(" [x] Sent '" + message + "'");

            channel.close();
            connection.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
