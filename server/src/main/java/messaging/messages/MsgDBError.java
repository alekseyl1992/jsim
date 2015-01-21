package messaging.messages;
import messaging.services.IFrontendService;
import messaging.Address;

public class MsgDBError extends MsgToFS {
	private String sessionId;

	public MsgDBError(Address from, Address to, String sessionId) {
		super(from, to);
		this.sessionId = sessionId;
	}

	void exec(IFrontendService frontend) {
		frontend.setError(sessionId);
	}
}
