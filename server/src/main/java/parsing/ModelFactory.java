package parsing;

import org.json.JSONArray;
import org.json.JSONObject;
import parsing.formats.model.ModelFields;
import parsing.formats.model.QObjectFields;

public class ModelFactory {
    public Model createModel(JSONObject json) throws ModelParsingError {
        Model model = new Model();

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
                String idTo = jsonObject.getString(QObjectFields.TO);
                model.connect(idFrom, idTo);
            } else if (jsonObject.has(QObjectFields.TO_A)
                    && jsonObject.has(QObjectFields.TO_B)) {
                String idToA = jsonObject.getString(QObjectFields.TO_A);
                String idToB = jsonObject.getString(QObjectFields.TO_B);

                model.connect(idFrom, idToA, idToB);
            }
        }

        return model;
    }

    public static void main(String[] args) {
        //TODO: open js_model_test.json

        JSONObject json = new JSONObject("");


        ModelFactory factory = new ModelFactory();
        try {
            factory.createModel(json);
        } catch (ModelParsingError modelParsingError) {
            modelParsingError.printStackTrace();
        }
    }
}
