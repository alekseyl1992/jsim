import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.QueueingConsumer;

import java.io.IOException;

public class TaskReciever implements Runnable {
    private static final String TASK_QUEUE_NAME = "task_queue";
    
    @Override
    public void run() {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost("localhost");
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();

            channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

            channel.basicQos(1);

            QueueingConsumer consumer = new QueueingConsumer(channel);
            channel.basicConsume(TASK_QUEUE_NAME, false, consumer);

            while (true) {
                QueueingConsumer.Delivery delivery = consumer.nextDelivery();
                String message = new String(delivery.getBody());

                System.out.println(" [x] Received '" + message + "'");
                //doWork(message);
                System.out.println(" [x] Done");

                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
