package messaging;

import messaging.messages.Msg;

import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class MessageSystem {
	private Map<Address, ConcurrentLinkedQueue<Msg>> queues = new HashMap<Address, ConcurrentLinkedQueue<Msg>>();
	private AddressService addressService = new AddressService();
	
	public void addService(Subscriber subscriber) {
		queues.put(subscriber.getAddress(), new ConcurrentLinkedQueue<Msg>());
	}
	
	public void sendMessage(Msg message) {
		Queue<Msg> messageQueue = queues.get(message.getTo());
		messageQueue.add(message);		
	}
		
	public void execForSubscriber(Subscriber subscriber) {
		Queue<Msg> messageQueue = queues.get(subscriber.getAddress());
		if(messageQueue == null){
			return;
		}
		while(!messageQueue.isEmpty()) {
			Msg message = messageQueue.poll();
			message.exec(subscriber);
		}
	}
	
	public AddressService getAddressService() {
		return addressService;
	}
}
