package database.dao;

import database.ConstraintException;
import database.DBException;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.TransactionException;
import org.hibernate.exception.ConstraintViolationException;
import database.AutoSession;

import java.io.Serializable;

public abstract class AbstractDAO {
    protected SessionFactory sessionFactory;

    public AbstractDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void save(Serializable dataSet) throws DBException {
        Transaction trx = null;

        try (AutoSession session = new AutoSession(sessionFactory.openSession())) {
            trx = session.beginTransaction();
            session.save(dataSet);
            trx.commit();
        }
        catch (ConstraintViolationException e) {
            try {
                if (trx != null)
                    trx.rollback();
            }
            catch (TransactionException ignore) {}

            throw new ConstraintException(e);
        }
        catch (HibernateException e) {
            try {
                if (trx != null)
                    trx.rollback();
            }
            catch (TransactionException ignore) {}

            throw new DBException(e);
        }
    }

    public abstract Serializable get(long id) throws DBException;
}
