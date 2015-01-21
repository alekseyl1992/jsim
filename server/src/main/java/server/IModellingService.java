package server;

import database.DBException;
import database.datasets.ModelDataSet;
import messaging.Subscriber;

public interface IModellingService extends Subscriber, Runnable {
    ModelDataSet getModel(long authorId, String name) throws DBException;
    void saveModel(long authorId, String name, String data) throws DBException;
    //TODO: renameModel()?
}
