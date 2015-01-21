package messaging.messages;
import messaging.services.IFrontendService;
import messaging.Address;
import messaging.Subscriber;

public abstract class MsgToFS extends Msg {

	public MsgToFS(Address from, Address to) {
		super(from, to);
	}

	public void exec(Subscriber subscriber) {
		if(subscriber instanceof IFrontendService){
			exec((IFrontendService)subscriber);
		}
	}
	
	abstract void exec(IFrontendService frontend);
}
