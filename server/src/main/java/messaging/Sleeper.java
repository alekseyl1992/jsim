package messaging;

public class Sleeper {
    public static final int TICK = 10;

	public static void sleep(int ms){
		try{
			Thread.sleep(ms);
		} catch (InterruptedException e) {				
			e.printStackTrace();
		}
	}
}
