package database.dao;

import database.DBException;
import database.datasets.ModelDataSet;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import server.AutoSession;

public class ModelDAO extends AbstractDAO {
    public ModelDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public ModelDataSet get(long id) throws DBException {
        try (AutoSession session = new AutoSession(sessionFactory.openSession())) {
            return (ModelDataSet) session.get(ModelDataSet.class, id);
        }
        catch (HibernateException e) {
            throw new DBException(e);
        }
    }

    public ModelDataSet get(long authorId, String name) throws DBException {
        try (AutoSession session = new AutoSession(sessionFactory.openSession())) {
            Criteria criteria = session.createCriteria(ModelDataSet.class);
            criteria.add(Restrictions.eq("authorId", authorId));
            criteria.add(Restrictions.eq("name", name));

            return (ModelDataSet) criteria.uniqueResult();
        }
        catch (HibernateException e) {
            throw new DBException(e);
        }
    }
}