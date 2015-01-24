public class Server {
    public static void main(String[] args) {
        RmqFacade rmq = new RmqFacade(); //TODO: ip, port from config
        rmq.start();
        
        TaskReceiver taskReceiver = new TaskReceiver(rmq);
        taskReceiver.run();

        System.out.println("TaskReceiver stopped for some reason. Server will be terminated now.");
        System.exit(-1);
    }
}
