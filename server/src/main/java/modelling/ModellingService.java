package modelling;

import database.DBException;
import database.DatabaseService;
import database.dao.ModelDAO;
import database.dao.UserDAO;
import database.datasets.ModelDataSet;
import messaging.Address;
import messaging.MessageSystem;
import messaging.Sleeper;
import messaging.Subscriber;
import messaging.services.IModellingService;

public class ModellingService implements IModellingService, Subscriber, Runnable {
    private DatabaseService databaseService;
    private MessageSystem ms;
    private Address address;

    public ModellingService(MessageSystem ms, DatabaseService databaseService) {
        this.ms = ms;
        this.databaseService = databaseService;

        this.address = new Address();
        ms.addService(this);
        ms.getAddressService().setModellingService(address);
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

    @Override
    public ModelDataSet getModel(long authorId, String name) throws DBException {
        ModelDAO dao = new ModelDAO(databaseService.getSessionFactory());
        ModelDataSet model = dao.get(authorId, name);

        return model;
    }

    @Override
    public void saveModel(long authorId, String name, String data) throws DBException {
        UserDAO dao = new UserDAO(databaseService.getSessionFactory());
        ModelDataSet model = new ModelDataSet(authorId, name, data);

        dao.save(model);
    }
}
