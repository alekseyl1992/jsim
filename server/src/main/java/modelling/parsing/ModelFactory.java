package modelling.parsing;

import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import modelling.parsing.formats.model.ModelFields;
import modelling.parsing.formats.model.QObjectFields;

import java.io.IOException;
import java.io.InputStream;


//TODO: think about id type (currently it is String)
// and toA/toB not being part of spec, to not being part of "super" object
public class ModelFactory {
    public Model createModel(JSONObject json) throws ModelParsingError {
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
