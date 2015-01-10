package parsing;

import org.json.JSONArray;
import org.json.JSONObject;
import parsing.enums.ModelFields;
import parsing.enums.QObjectFields;

public class ModelFactory {
    public Model createModel(JSONObject json) throws ModelParsingError {
        Model model = new Model();

        QObjectFactory qObjectFactory = new QObjectFactory(model.getSim());

        JSONArray jsonObjects = json.getJSONArray(ModelFields.OBJECTS.toString());

        // first pass to create
        for (int i = 0; i < jsonObjects.length(); ++i) {
            JSONObject jsonObject = jsonObjects.getJSONObject(i);
            model.addQObject(qObjectFactory.createQObject(jsonObject));
        }

        // second pass to connect
        for (int i = 0; i < jsonObjects.length(); ++i) {
            JSONObject jsonObject = jsonObjects.getJSONObject(i);

            String idFrom = jsonObject.getString(QObjectFields.ID.toString());

            if (jsonObject.has(QObjectFields.TO.toString())) {
                String idTo = jsonObject.getString(QObjectFields.TO.toString());
                model.connect(idFrom, idTo);
            } else if (jsonObject.has(QObjectFields.TO_A.toString())
                    && jsonObject.has(QObjectFields.TO_B.toString())) {
                String idToA = jsonObject.getString(QObjectFields.TO_A.toString());
                String idToB = jsonObject.getString(QObjectFields.TO_B.toString());

                double pA = jsonObject.getDouble(QObjectFields.P_A.toString());

                model.connect(idFrom, idToA, idToB, pA);
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
