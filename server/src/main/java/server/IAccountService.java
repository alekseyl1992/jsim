package server;

import database.DBException;
import database.datasets.UserDataSet;
import messaging.Subscriber;

public interface IAccountService extends Subscriber, Runnable {
    Long tryRegister(String login, String password, String email) throws DBException;
    Long tryLogin(String login, String password) throws DBException;
    UserDataSet getUser(Long userId) throws DBException;
    boolean exists(Long userId) throws DBException;
}
