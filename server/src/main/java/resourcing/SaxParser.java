package resourcing;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class SaxParser {
	public static Resource parse(String xmlFile) throws ParserException {
	    try {	 
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();
		 
			SaxHandler handler = new SaxHandler();

            InputStream is = new ByteArrayInputStream(xmlFile.getBytes("UTF-8"));
			saxParser.parse(is, handler);
            is.close();

	        return handler.getResource();
	    }
        catch (Exception e) {
            throw new ParserException(e);
        }
    }
}
