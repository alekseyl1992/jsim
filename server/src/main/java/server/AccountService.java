package server;

import database.DBException;
import database.DatabaseService;
import database.dao.UserDAO;
import database.datasets.UserDataSet;
import messaging.Address;
import messaging.MessageSystem;
import messaging.Sleeper;
import messaging.Subscriber;

public class AccountService implements IAccountService, Subscriber, Runnable {
    private DatabaseService databaseService;
    private MessageSystem ms;
    private Address address;

    public AccountService(MessageSystem ms, DatabaseService databaseService) {
        this.ms = ms;
        this.databaseService = databaseService;

        this.address = new Address();
        ms.addService(this);
        ms.getAddressService().setAccountService(address);
    }

    @Override
    public void run() {
        while(!Thread.currentThread().isInterrupted()){
            ms.execForSubscriber(this);
            Sleeper.sleep(Sleeper.TICK);
        }
    }

    @Override
    public Address getAddress() {
        return address;
    }

    @Override
    public MessageSystem getMessageSystem() {
        return ms;
    }

    public Long tryLogin(String login, String password) throws DBException {
        UserDAO dao = new UserDAO(databaseService.getSessionFactory());
        UserDataSet user = dao.get(login);
        if (user != null && user.getPassword().equals(password))
            return user.getId();
        else
            return null;
    }

    public Long tryRegister(String login, String password, String email) throws DBException {
        UserDAO dao = new UserDAO(databaseService.getSessionFactory());
        UserDataSet user = new UserDataSet(login, password, email);

        if (dao.save(user))
            return user.getId();
        else
            return null;
    }

    public UserDataSet getUser(Long userId) throws DBException {
        if (userId == null)
            return null;

        UserDAO dao = new UserDAO(databaseService.getSessionFactory());
        return dao.get(userId);
    }

    public boolean exists(Long userId) throws DBException {
        return getUser(userId) != null;
    }
}
