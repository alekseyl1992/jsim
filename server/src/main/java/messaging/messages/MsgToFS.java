package messaging.messages;
import frontend.FrontendServlet;
import messaging.Address;
import messaging.Subscriber;

public abstract class MsgToFS extends Msg {

	public MsgToFS(Address from, Address to) {
		super(from, to);
	}

	public void exec(Subscriber subscriber) {
		if(subscriber instanceof FrontendServlet){
			exec((FrontendServlet)subscriber);
		}
	}
	
	abstract void exec(FrontendServlet frontend);
}
