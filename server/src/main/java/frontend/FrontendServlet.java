package frontend;

import messaging.Address;
import messaging.MessageSystem;
import messaging.Sleeper;
import messaging.messages.MsgLoginUser;
import messaging.messages.MsgRegisterUser;
import messaging.services.IFrontendService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;

import static utils.LambdaUtils.wrapToRTE;

public class FrontendServlet extends HttpServlet implements IFrontendService {
    private DateFormat formatter = new SimpleDateFormat("HH.mm.ss");
    private MessageSystem ms;
    private Address address;
    private Map<String, BiConsumer<HttpServletRequest, HttpServletResponse>> getRouter = new HashMap<>();
    private Map<String, BiConsumer<HttpServletRequest, HttpServletResponse>> postRouter = new HashMap<>();

    private Map<String, UserSession> sessionIdToUserSession = new HashMap<>();

    public FrontendServlet(MessageSystem ms) {
        this.ms = ms;

        this.address = new Address();
        ms.addService(this);
        ms.getAddressService().setFrontendServlet(address);

        getRouter.put(Locations.TIMER, wrapToRTE(this::timerView));
        getRouter.put(Locations.INDEX, wrapToRTE(this::indexView));
        getRouter.put(Locations.POLL, wrapToRTE(this::pollView));
        getRouter.put(Locations.REGISTRATION, wrapToRTE(this::registrationView));

        postRouter.put(Locations.LOGIN, wrapToRTE(this::tryLogin));
        postRouter.put(Locations.REGISTER, wrapToRTE(this::tryRegister));
    }

    @Override
    public void run() {
        while(!Thread.currentThread().isInterrupted()) {
            ms.execForSubscriber(this);
            Sleeper.sleep(Sleeper.TICK);
        }
    }

    @Override
    public Address getAddress() {
        return address;
    }

    @Override
    public MessageSystem getMessageSystem() {
        return ms;
    }

    @Override
    public void setId(String sessionId, Long userId) {
        UserSession userSession = sessionIdToUserSession.get(sessionId);
        if (userSession == null) {
            System.out.append("Can't find user session for: ").append(sessionId);
            return;
        }
        userSession.setUserId(userId);
    }

    @Override
    public void setError(String sessionId) {
        UserSession userSession = sessionIdToUserSession.get(sessionId);
        if (userSession == null) {
            System.out.append("Can't find user session for: ").append(sessionId);
            return;
        }
        userSession.setError(true);
    }

    @Override
    public String getIndexLocation() {
        return Locations.INDEX;
    }

    public void doGet(HttpServletRequest request,
                      HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);

        BiConsumer<HttpServletRequest, HttpServletResponse> view = getRouter.get(request.getPathInfo());

        if (view != null)
            view.accept(request, response);
        else
            response.sendRedirect(Locations.INDEX);
    }

    public void doPost(HttpServletRequest request,
                       HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);

        BiConsumer<HttpServletRequest, HttpServletResponse> view = postRouter.get(request.getPathInfo());

        if (view != null)
            view.accept(request, response);
        else
            response.sendRedirect(Locations.INDEX);
    }

    private void tryLogin(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        String login = request.getParameter("login");
        String password = request.getParameter("password");

        if (!checkCredentials(login, password, login)) {
            response.getWriter().print("wrong");
            return;
        }

        String sessionId = request.getSession().getId();
        UserSession userSession = new UserSession(sessionId, login, ms.getAddressService());
        sessionIdToUserSession.put(sessionId, userSession);

        Address frontendAddress = getAddress();
        Address accountServiceAddress = userSession.getAccountService();

        ms.sendMessage(new MsgLoginUser(frontendAddress, accountServiceAddress,
                login, password, sessionId));

        response.getWriter().print("auth started");
    }

    private void tryRegister(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        String login = request.getParameter("login");
        String password = request.getParameter("password");
        String email = request.getParameter("email");

        if (!checkCredentials(login, password, email)) {
            response.getWriter().print("wrong");
            return;
        }

        String sessionId = request.getSession().getId();
        UserSession userSession = new UserSession(sessionId, login, ms.getAddressService());
        sessionIdToUserSession.put(sessionId, userSession);

        Address frontendAddress = getAddress();
        Address accountServiceAddress = userSession.getAccountService();

        ms.sendMessage(new MsgRegisterUser(frontendAddress, accountServiceAddress,
                login, password, email, sessionId));

        response.getWriter().print("registration started");
    }

    private void timerView(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException  {
        Map<String, Object> pageVariables = new HashMap<>();
        pageVariables.put("refreshPeriod", "1000");
        pageVariables.put("serverTime", formatter.format(new Date()));

        HttpSession session = request.getSession();
        UserSession userSession = sessionIdToUserSession.get(session.getId());
        if (userSession == null) {
            response.sendRedirect(Locations.INDEX);
        }
        else {
            pageVariables.put("login", userSession.getLogin());
            pageVariables.put("id", userSession.getUserId());
            response.getWriter().println(PageGenerator.getPage(Templates.TIMER, pageVariables));
        }
   }

    private void pollView(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException  {

        HttpSession session = request.getSession();
        UserSession userSession = sessionIdToUserSession.get(session.getId());
        String result;

        if (userSession == null || userSession.isError())
            result = "error";
        else if (userSession.isWrong())
            result = "wrong";
        else if (userSession.isAuthorized())
            result = "ok";
        else
            result = "wait";

        response.getWriter().print(result);
    }

    private void indexView(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException  {
        renderPage(response, Templates.INDEX);
    }

    private void registrationView(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException  {
        renderPage(response, Templates.REGISTRATION);
    }

    private void renderPage(HttpServletResponse response, String template) throws IOException {
        response.getWriter().println(PageGenerator.getPage(template, null));
    }

    private boolean checkCredentials(String login, String password, String email) {
        return login     != null && !login.isEmpty() &&
               password  != null && !password.isEmpty() &&
               email     != null && !email.isEmpty();
    }
}
