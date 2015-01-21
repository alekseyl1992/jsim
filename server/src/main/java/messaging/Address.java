package messaging;

import java.util.concurrent.atomic.AtomicInteger;

public class Address {
	static private AtomicInteger subscriberIdCreator = new AtomicInteger();
	final private int subscriberId;

	public Address(){
		this.subscriberId = subscriberIdCreator.incrementAndGet();
	}	
	
	public int hashCode(){
		return subscriberId;
	}	
}