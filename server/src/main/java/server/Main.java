package server;

import database.DatabaseService;
import resourcing.ResourceSystem;

public class Main {
    public static void main(String[] args) throws Exception {
        ResourceSystem rs = ResourceSystem.getInstance();
        String port = rs.getConfig("server").get("port");

        JSimServer server = new JSimServer(Integer.parseInt(port),
                new DatabaseService(rs.getConfig("mysql")));

        server.start();
    }
}