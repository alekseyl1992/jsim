import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class RmqFacade {
    private Channel channel;
    
    private List<String> declaredQueues = new ArrayList<>();
    
    public RmqFacade() {

    }

    public void start() {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost("localhost");
            Connection connection = factory.newConnection();
            channel = connection.createChannel();
            channel.basicQos(1);

            System.out.println("[RMQ] RMQ client started successfully");
        } catch (IOException e) {
            restart();
        }
    }
    
    public void stop() {
        try {
            channel.close();
            channel.getConnection().close();
        } catch (IOException e) {
            System.err.println("[RMQ] Error while stopping RMQ client");
            e.printStackTrace();
        }
    }
    
    public void restart() {
        System.err.println("[RMQ] Restarting RMQ client...");
        stop();
        start();
        
        // redeclate all queues
        for (String queue: declaredQueues)
            declareQueue(queue);
        
        System.err.println("[RMQ] RMQ client restarted successfully");
    }
    
    public void declareQueue(String queue) {
        try {
            channel.queueDeclare(queue, true, false, false, null);
            System.out.println("[RMQ] Queue declared: " + queue);
            
            declaredQueues.add(queue);
        } catch (IOException e) {
            System.err.println("[RMQ] Unable to declare queue: " + queue);
            restart();
        }
    }
    
    public void startConsumer(String queue, Consumer<String> callback) {
        try {
            QueueingConsumer consumer = new QueueingConsumer(channel);
            channel.basicConsume(queue, false, consumer);

            System.out.println("[RMQ] Consumer started successfully on: " + queue);

            while (!Thread.interrupted()) {
                QueueingConsumer.Delivery delivery = consumer.nextDelivery();
                String message = new String(delivery.getBody());

                System.out.println("[RMQ] Received '" + message + "'");
                callback.accept(message);

                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
            }
        } catch (IOException e) {
            restart();
            
            //restart consumer
            startConsumer(queue, callback);
        } catch (InterruptedException e) {
            System.err.println("[RMQ] Consumer thread was interrupted, stopping...");
            stop();
        }
    }
    
    public void send(String queue, String message) {
        try {
            channel.basicPublish("", queue,
                    MessageProperties.PERSISTENT_TEXT_PLAIN,
                    message.getBytes());
        } catch (IOException e) {
            restart();
            
            // retry
            send(queue, message);
        }
    }
}
