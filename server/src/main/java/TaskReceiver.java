import modelling.parsing.Model;
import modelling.parsing.ModelFactory;
import modelling.parsing.ModelParsingError;
import modelling.parsing.formats.model.ModelFields;
import modelling.parsing.formats.rmq.Error;
import modelling.parsing.formats.rmq.Progress;
import modelling.parsing.formats.rmq.Stats;
import modelling.parsing.formats.rmq.TaskFields;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TaskReceiver implements Runnable {
    private static final String TASK_QUEUE_NAME = "jsim.tasks";
    private static final String PROGRESS_QUEUE_NAME = "jsim.progress";
    private static final String STATS_QUEUE_NAME = "jsim.stats";
    private static final String ERROR_QUEUE_NAME = "jsim.error";
    
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
        int runsCount;
        
        try {
            JSONObject task = new JSONObject(taskStr);
            taskId = task.getString(TaskFields.ID);

            modelJson = task.getJSONObject(TaskFields.MODEL);
            runsCount = modelJson.getInt(ModelFields.RUNS_COUNT);

            System.out.println("[TR] Model parsed for taskId: " + taskId);
        } catch (JSONException e) {
            System.err.println("[TR] Error parsing task: " + taskStr);
            e.printStackTrace();
            return;
        }


        executorService.submit(() -> {
            System.out.println("[TR] Validation started for taskId: " + taskId);

            try {
                Model model = ModelFactory.createModel(modelJson);
                model.validate();
            } catch (ModelParsingError e) {
                sendError(taskId, e);
                System.out.println("[TR] Validation error for taskId: " + taskId);
                return;
            }
            System.out.println("[TR] Validation successful for taskId: " + taskId);

            System.out.println("[TR] Simulation started for taskId: " + taskId);

            JSONArray statsArray = new JSONArray();

            for (int i = 0; i < runsCount; ++i) {
                final int runId = i;

                try {
                    Model model = ModelFactory.createModel(modelJson);
                    model.setProgressCallback((Double progress) -> sendProgress(taskId, progress, runId, runsCount));

                    System.out.format("[TR] Simulation run: %d for taskId: %s\n", runId, taskId);
                    JSONObject stats = model.startSimulation();
                    statsArray.put(stats);
                } catch (ModelParsingError e) {
                    sendError(taskId, e);
                }
            }

            System.out.println("[TR] Simulation finished for taskId: " + taskId);

            sendStats(taskId, statsArray);
        });

    }

    private void sendProgress(String taskId, double progress, int runId, int runsCount) {
        double overallProgress = (double)runId / runsCount + progress / runsCount;

        String jsonStr = Progress.toJsonString(taskId, overallProgress);
        rmq.send(PROGRESS_QUEUE_NAME, jsonStr);
    }

    private void sendStats(String taskId, JSONArray stats) {
        String jsonStr = Stats.toJsonString(taskId, stats);
        rmq.send(STATS_QUEUE_NAME, jsonStr);
    }

    private void sendError(String taskId, Throwable error) {
        System.out.println("[TR] Model error: " + error.getMessage());

        String jsonStr = Error.toJsonString(taskId, error);
        rmq.send(ERROR_QUEUE_NAME, jsonStr);
    }
}
