import modelling.parsing.Model;
import modelling.parsing.ModelFactory;
import modelling.parsing.ModelParsingError;
import modelling.parsing.formats.rmq.Error;
import modelling.parsing.formats.rmq.Progress;
import modelling.parsing.formats.rmq.Stats;
import modelling.parsing.formats.rmq.TaskFields;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TaskReceiver implements Runnable {
    private static final String TASK_QUEUE_NAME = "task_queue";
    private static final String PROGRESS_QUEUE_NAME = "progress_queue";
    private static final String STATS_QUEUE_NAME = "stats_queue";
    private static final String ERROR_QUEUE_NAME = "error_queue";
    
    private RmqFacade rmq;
    private ExecutorService executorService;
    
    public TaskReceiver(RmqFacade rmq) {
        executorService = Executors.newWorkStealingPool();
        this.rmq = rmq;
    }
    
    @Override
    public void run() {
        rmq.declareQueue(TASK_QUEUE_NAME);

        rmq.declareQueue(PROGRESS_QUEUE_NAME);
        rmq.declareQueue(STATS_QUEUE_NAME);
        rmq.declareQueue(ERROR_QUEUE_NAME);

        rmq.startConsumer(TASK_QUEUE_NAME, this::handleTask);
    }
    
    private void handleTask(String taskStr) {
        JSONObject modelJson;
        String taskId;
        
        try {
            JSONObject task = new JSONObject(taskStr);
            taskId = task.getString(TaskFields.ID);
            modelJson = task.getJSONObject(TaskFields.MODEL);
        } catch (JSONException e) {
            e.printStackTrace();
            return;
        }
            
        try {
            Model model = ModelFactory.createModel(modelJson);
            model.setProgressCallback((Double progress) -> sendProgress(taskId, progress));

            executorService.submit(() -> {
                JSONObject stats = model.startSimulation();
                sendStats(taskId, stats);
            });
        } catch (ModelParsingError e) {
            sendError(taskId, e);
        }
    }

    private void sendProgress(String taskId, double progress) {
        String jsonStr = Progress.toJsonString(taskId, progress);
        rmq.send(PROGRESS_QUEUE_NAME, jsonStr);
    }

    private void sendStats(String taskId, JSONObject stats) {
        String jsonStr = Stats.toJsonString(taskId, stats);
        rmq.send(STATS_QUEUE_NAME, jsonStr);
    }

    private void sendError(String taskId, Throwable error) {
        String jsonStr = Error.toJsonString(taskId, error);
        rmq.send(ERROR_QUEUE_NAME, jsonStr);
    }
}
