package messaging.messages;
import messaging.MessagingException;
import messaging.services.IFrontendService;
import messaging.Address;
import messaging.Subscriber;

public abstract class MsgToFS extends Msg {

	public MsgToFS(Address from, Address to) {
		super(from, to);
	}

	@Override
	public void exec(Subscriber subscriber) throws MessagingException {
		if(subscriber instanceof IFrontendService)
			exec((IFrontendService)subscriber);
		else
			throw new MessagingException();
	}
	
	abstract void exec(IFrontendService frontend);
}
