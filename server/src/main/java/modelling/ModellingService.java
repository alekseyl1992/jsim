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
import modelling.parsing.Model;
import modelling.parsing.ModelFactory;
import modelling.parsing.ModelParsingError;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ModellingService implements IModellingService, Subscriber, Runnable {
    private DatabaseService databaseService;
    private MessageSystem ms;
    private Address address;

    private ExecutorService executorService;

    public ModellingService(MessageSystem ms, DatabaseService databaseService) {
        this.ms = ms;
        this.databaseService = databaseService;
        this.address = new Address();

        ms.addService(this);
        ms.getAddressService().setModellingService(address);

        executorService = Executors.newWorkStealingPool();
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
    public Model getModel(long authorId, String name) throws DBException, ModelParsingError {
        ModelDAO dao = new ModelDAO(databaseService.getSessionFactory());
        ModelDataSet modelDataSet = dao.get(authorId, name);

        Model model = ModelFactory.createModel(modelDataSet.getData());

        return model;
    }

    @Override
    public void saveModel(long authorId, String name, String data) throws DBException {
        UserDAO dao = new UserDAO(databaseService.getSessionFactory());
        ModelDataSet model = new ModelDataSet(authorId, name, data);

        dao.save(model);
    }

    @Override
    public Future<JSONObject> startModel(Model model) {
        Future<JSONObject> result = executorService.submit(model::startSimulation);

        return result;
    }
}
