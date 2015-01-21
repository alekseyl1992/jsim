package messaging.messages;

import messaging.Address;
import messaging.Subscriber;
import accounting.AccountService;
import messaging.services.IAccountService;

public abstract class MsgToAS extends Msg {

	public MsgToAS(Address from, Address to) {
		super(from, to);		
	}

	public void exec(Subscriber subscriber) {
		if(subscriber instanceof AccountService){
			exec((AccountService) subscriber);
		}
	}

	public abstract void exec(IAccountService accountService);
}
