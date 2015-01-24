
public class Server {
    public static void main(String[] args) throws InterruptedException {
        Thread statusReporter = new Thread(new StatusReporter());
        Thread taskReceiver = new Thread(new TaskReciever());
        
        statusReporter.start();
        taskReceiver.start();
        
        statusReporter.join();
        taskReceiver.join();
    }
}
