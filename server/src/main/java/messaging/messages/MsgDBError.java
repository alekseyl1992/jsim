package messaging.messages;
import frontend.FrontendServlet;
import messaging.Address;

public class MsgDBError extends MsgToFS {
	private String sessionId;

	public MsgDBError(Address from, Address to, String sessionId) {
		super(from, to);
		this.sessionId = sessionId;
	}

	void exec(FrontendServlet frontend) {
		frontend.setError(sessionId);
	}
}
