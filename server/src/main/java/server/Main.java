package server;

import database.DatabaseService;
import resourcing.ResourceSystem;

public class Main {
    public static void main(String[] args) throws Exception {
        ResourceSystem rs = ResourceSystem.getInstance();
        String port = rs.getConfig("server").get("port");

        GameServer server = new GameServer(Integer.parseInt(port),
                new DatabaseService(rs.getConfig("mysql")));

        server.start();
    }
}