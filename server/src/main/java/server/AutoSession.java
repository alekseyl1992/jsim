package server;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.Serializable;

//adapter pattern realization for hibernate.Session
public class AutoSession implements AutoCloseable {
    Session session;

    public AutoSession(Session session) {
        this.session = session;
    }

    @Override
    public void close() throws HibernateException {
        session.close();
    }

    public Object get(Class clazz, Serializable obj) {
        return session.get(clazz, obj);
    }

    public Transaction beginTransaction() {
        return session.beginTransaction();
    }

    public void save(Serializable obj) {
        session.save(obj);
    }

    public Criteria createCriteria(Class clazz) {
        return session.createCriteria(clazz);
    }
}
