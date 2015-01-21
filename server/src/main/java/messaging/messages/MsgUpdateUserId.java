package messaging.messages;
import messaging.services.IFrontendService;
import messaging.Address;

public class MsgUpdateUserId extends MsgToFS {
	private String sessionId;
	private Long id;
	
	public MsgUpdateUserId(Address from, Address to, String sessionId, Long id) {
		super(from, to);
		this.sessionId = sessionId;
		this.id = id;
	}

	public void exec(IFrontendService frontend) {
		frontend.setId(sessionId, id);
	}
}
