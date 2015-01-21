package database;

import database.datasets.UserDataSet;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

import java.util.Map;

public class DatabaseService {
    protected SessionFactory sessionFactory;

    public DatabaseService(Map<String, String> config) throws Exception {
        Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(UserDataSet.class);

        for (Map.Entry<String, String> entry: config.entrySet())
            configuration.setProperty(entry.getKey(), entry.getValue());

        sessionFactory = createSessionFactory(configuration);
    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    protected SessionFactory createSessionFactory(Configuration configuration) {
        StandardServiceRegistryBuilder builder = new StandardServiceRegistryBuilder();
        builder.applySettings(configuration.getProperties());
        ServiceRegistry serviceRegistry = builder.build();
        return configuration.buildSessionFactory(serviceRegistry);
    }
}
