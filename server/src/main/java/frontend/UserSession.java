package frontend;

import messaging.Address;
import messaging.AddressService;
import modelling.parsing.Model;
import org.json.JSONObject;

import java.util.concurrent.Future;

public class UserSession {
    private Address accountService;

    private String login;
    private String sessionId;
    private Long userId;
    private boolean isWrong = false;
    private boolean isError = false;

    private Future<JSONObject> currentModelStats;
    private Model currentModel;

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

    public Future<JSONObject> getCurrentModelStats() {
        return currentModelStats;
    }

    public void setCurrentModelStats(Future<JSONObject> currentModelStats) {
        this.currentModelStats = currentModelStats;
    }

    public Model getCurrentModel() {
        return currentModel;
    }

    public void setCurrentModel(Model currentModel) {
        this.currentModel = currentModel;
    }
}