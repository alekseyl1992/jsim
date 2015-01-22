package messaging.messages;

import messaging.Address;
import messaging.MessagingException;
import messaging.Subscriber;
import messaging.services.IAccountService;

public abstract class MsgToAS extends Msg {

	public MsgToAS(Address from, Address to) {
		super(from, to);		
	}

	@Override
	public void exec(Subscriber subscriber) throws MessagingException {
		if(subscriber instanceof IAccountService)
			exec((IAccountService) subscriber);
		else
			throw new MessagingException();
	}

	public abstract void exec(IAccountService accountService);
}
