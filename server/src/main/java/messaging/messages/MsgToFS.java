package messaging.messages;
import frontend.IFrontendServlet;
import messaging.Address;
import messaging.Subscriber;

public abstract class MsgToFS extends Msg {

	public MsgToFS(Address from, Address to) {
		super(from, to);
	}

	public void exec(Subscriber subscriber) {
		if(subscriber instanceof IFrontendServlet){
			exec((IFrontendServlet)subscriber);
		}
	}
	
	abstract void exec(IFrontendServlet frontend);
}
