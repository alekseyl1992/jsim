package server;

import database.DatabaseService;
import frontend.FrontendServlet;
import messaging.MessageSystem;
import org.eclipse.jetty.rewrite.handler.RedirectRegexRule;
import org.eclipse.jetty.rewrite.handler.RewriteHandler;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import resourcing.ResourceSystem;

public class GameServer {
    Server server;
    boolean running = false;

    public GameServer(int port, DatabaseService db) throws Exception {
        MessageSystem ms = new MessageSystem();
        IAccountService accountService = new AccountService(ms, db);
        FrontendServlet frontendServlet = new FrontendServlet(ms);

        ResourceSystem rs = ResourceSystem.getInstance();

        new Thread(frontendServlet).start();
        new Thread(accountService).start();

        server = new Server(port);

        RewriteHandler rewriteHandler = new RewriteHandler();

        rewriteHandler.setRewriteRequestURI(false);
        rewriteHandler.setRewritePathInfo(false);
        rewriteHandler.setOriginalPathAttribute("requestedPath");
        RedirectRegexRule rule = new RedirectRegexRule();
        rule.setRegex("/");
        rule.setReplacement("/index");
        rule.setHandling(true);

        rewriteHandler.addRule(rule);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.addServlet(new ServletHolder(frontendServlet), "/*");

        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase("static");

        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[]{rewriteHandler, resourceHandler, context});
        server.setHandler(handlers);
    }

    public void start() throws Exception {
        server.start();
        running = true;
        server.join();
        running = false;

    }

    public void stop() throws Exception {
        server.stop();
        running = false;
    }

    public boolean isRunning() {
        return running;
    }
}
