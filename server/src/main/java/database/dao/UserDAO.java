package database.dao;

import database.DBException;
import database.datasets.UserDataSet;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import database.AutoSession;

public class UserDAO extends AbstractDAO {
    public UserDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public UserDataSet get(long id) throws DBException {
        try (AutoSession session = new AutoSession(sessionFactory.openSession())) {
            return (UserDataSet) session.get(UserDataSet.class, id);
        }
        catch (HibernateException e) {
            throw new DBException(e);
        }
    }

    public UserDataSet get(String login) throws DBException {
        try (AutoSession session = new AutoSession(sessionFactory.openSession())) {
            Criteria criteria = session.createCriteria(UserDataSet.class);

            return (UserDataSet) criteria.add(Restrictions.eq("login", login))
                    .uniqueResult();
        }
        catch (HibernateException e) {
            throw new DBException(e);
        }
    }
}