package server;

import messaging.Address;
import messaging.AddressService;

public class UserSession {
    private Address accountService;

    private String login;
    private String sessionId;
    private Long userId;
    private boolean isWrong = false;
    private boolean isError = false;

    public UserSession(String sessionId, String name, AddressService addressService) {
        this.sessionId = sessionId;
        this.login = name;
        this.accountService = addressService.getAccountService();
    }

    public Address getAccountService() {
        return accountService;
    }

    public String getLogin(){
        return login;
    }

    public String getSessionId() {
        return sessionId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        if (userId == null)
            isWrong = true;

        this.userId = userId;
    }

    public boolean isWrong() {
        return isWrong;
    }

    public boolean isError() {
        return isError;
    }

    public void setError(boolean isError) {
        this.isError = isError;
    }

    public boolean isAuthorized() {
        return !isWrong() && !isError() && getUserId() != null;
    }
}