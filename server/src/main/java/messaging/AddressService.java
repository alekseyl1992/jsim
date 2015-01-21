package messaging;

public class AddressService {
    private Address accountService;
    private Address frontendServlet;

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
}
