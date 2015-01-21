package messaging.messages;
import messaging.Address;
import messaging.Subscriber;
import server.AccountService;

public abstract class MsgToAS extends Msg {

	public MsgToAS(Address from, Address to) {
		super(from, to);		
	}

	public void exec(Subscriber subscriber) {
		if(subscriber instanceof AccountService){
			exec((AccountService) subscriber);
		}
	}

	public abstract void exec(AccountService accountService);
}
