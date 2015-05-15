package modelling.parsing;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import modelling.parsing.formats.model.ModelFields;
import modelling.parsing.formats.model.QObjectFields;

import java.io.IOException;
import java.io.InputStream;

public class ModelFactory {
    public static Model createModel(String json) throws ModelParsingError {
        try {
            return createModel(new JSONObject(json));
        } catch (JSONException e) {
            throw new ModelParsingError("Unable to parse JSON", e);
        }
    }

    public static Model createModel(JSONObject json) throws ModelParsingError {
        Model model = new Model(json.getInt(ModelFields.DURATION));

        QObjectFactory qObjectFactory = new QObjectFactory(model);

        JSONArray jsonObjects = json.getJSONArray(ModelFields.OBJECTS);

        // first pass to create
        for (int i = 0; i < jsonObjects.length(); ++i) {
            JSONObject jsonObject = jsonObjects.getJSONObject(i);
            model.addQObject(qObjectFactory.createQObject(jsonObject));
        }

        // second pass to connect
        for (int i = 0; i < jsonObjects.length(); ++i) {
            JSONObject jsonObject = jsonObjects.getJSONObject(i);

            String idFrom = jsonObject.getString(QObjectFields.ID);

            if (jsonObject.has(QObjectFields.TO)) {
                try {
                    String idTo = jsonObject.getString(QObjectFields.TO);
                    model.connect(idFrom, idTo);
                } catch (JSONException e) {
                    throw new ModelParsingError("All outputs should be connected somewhere");
                }
            } else if (jsonObject.has(QObjectFields.TO_A)
                    && jsonObject.has(QObjectFields.TO_B)) {
                try {
                    String idToA = jsonObject.getString(QObjectFields.TO_A);
                    String idToB = jsonObject.getString(QObjectFields.TO_B);

                    model.connect(idFrom, idToA, idToB);
                } catch (JSONException e) {
                    throw new ModelParsingError("Both outputs of Splitter should be connected somewhere");
                }
            }
        }

        return model;
    }

    //TODO: move to test
    public static void main(String[] args) throws IOException {
        ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        InputStream is = classloader.getResourceAsStream("js_model_test.json");

        String str = IOUtils.toString(is, "UTF-8");
        JSONObject json = new JSONObject(str);


        ModelFactory factory = new ModelFactory();
        try {
            Model model = factory.createModel(json);
            JSONObject stats = model.startSimulation();

            System.out.println(stats);
        } catch (ModelParsingError modelParsingError) {
            modelParsingError.printStackTrace();
        }
    }
}
