package messaging.messages;

import messaging.Address;
import messaging.MessagingException;
import messaging.Subscriber;

public abstract class Msg {
	private Address from;
	private Address to;
	
	public Msg(Address from, Address to){
		this.from = from;
		this.to = to;
	}
	
	public Address getFrom(){
		return from;
	}
	
	public Address getTo(){
		return to;
	}
	
	public abstract void exec(Subscriber subscriber) throws MessagingException;
}
