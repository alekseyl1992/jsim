package messaging.messages;

import database.DBException;
import messaging.Address;
import server.IAccountService;

public class MsgLoginUser extends MsgToAS {
	private String login;
    private String password;
    private String sessionId;
	
	public MsgLoginUser(Address from, Address to, String login, String password, String sessionId) {
		super(from, to);
		this.login = login;
        this.password = password;
        this.sessionId = sessionId;
	}

	public void exec(IAccountService accountService) {
        try {
            Long id = accountService.tryLogin(login, password);
            accountService.getMessageSystem()
                    .sendMessage(new MsgUpdateUserId(getTo(), getFrom(), sessionId, id));
        }
        catch (DBException e) {
            accountService.getMessageSystem()
                    .sendMessage(new MsgDBError(getTo(), getFrom(), sessionId));
        }
	}
}
