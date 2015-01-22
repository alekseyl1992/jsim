package messaging.services;

import database.DBException;
import messaging.Subscriber;
import modelling.parsing.Model;
import modelling.parsing.ModelParsingError;
import org.json.JSONObject;

import java.util.concurrent.Future;

public interface IModellingService extends Subscriber, Runnable {
    Model getModel(long authorId, String name) throws DBException, ModelParsingError;
    void saveModel(long authorId, String name, String data) throws DBException;

    Future<JSONObject> startModel(Model model);
    //TODO: renameModel()?
}
