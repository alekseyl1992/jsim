package messaging;

public class AddressService {
    private Address accountService;
    private Address frontendServlet;
    private Address modellingService;

    public Address getAccountService() {
        return accountService;
    }

    public void setAccountService(Address accountService) {
        this.accountService = accountService;
    }

    public Address getFrontendServlet() {
        return frontendServlet;
    }

    public void setFrontendServlet(Address frontendServlet) {
        this.frontendServlet = frontendServlet;
    }

    public Address getModellingService() {
        return modellingService;
    }

    public void setModellingService(Address modellingService) {
        this.modellingService = modellingService;
    }
}
