package resourcing;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class DOMParser {
    public static Map<String, String> parse(String xmlFile) throws ParserException {
        Map<String, String> result = new HashMap<>();

        try {
            DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = f.newDocumentBuilder();

            InputStream is = new ByteArrayInputStream(xmlFile.getBytes("UTF-8"));
            Document doc = builder.parse(is);
            is.close();

            NodeList children = doc.getDocumentElement().getElementsByTagName("property");
            for (int i = 0; i < children.getLength(); ++i) {
                Node node = children.item(i);
                NamedNodeMap attributes = node.getAttributes();
                String name = attributes.getNamedItem("name").getNodeValue();
                String value = node.getTextContent();

                result.put(name, value);
            }
        }
        catch (ParserConfigurationException | SAXException | IOException e) {
            throw new ParserException(e);
        }

        return result;
    }
}
