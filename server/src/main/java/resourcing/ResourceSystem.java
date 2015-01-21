package resourcing;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ResourceSystem {
    private Map<String, Resource> resources = new HashMap<>();
    private Map<String, Map<String, String>> configs = new HashMap<>();
    private static ResourceSystem instance;
    private static final String RESOURCES_ROOT = "./server/resources"; //for SAX
    private static final String CONFIGS_ROOT = "./server/configs"; //for DOM

    private ResourceSystem() {

    }

    public static ResourceSystem getInstance() {
        if (instance == null) {
            instance = new ResourceSystem();
            instance.reloadResources();
            instance.reloadConfigs();
        }

        return instance;
    }

    public Resource getResource(String fileName) {
        return resources.get(fileName + ".xml");
    }

    public Map<String, String> getConfig(String fileName) {
        return configs.get(fileName + ".xml");
    }

    public void reloadResources() {
        VFS vfs = new VFSImpl(RESOURCES_ROOT);
        resources.clear();

        for (String fileName: vfs.iterate(RESOURCES_ROOT)) {
            if (!vfs.isDirectory(fileName)) {
                try {
                    Resource resource = SaxParser.parse(vfs.getUTF8Text(fileName));
                    resources.put(vfs.getFileName(fileName), resource);
                } catch (ParserException | IOException e) {
                    System.err.println("Unable to load resource: " + fileName);
                    e.printStackTrace();
                }
            }
        }
    }

    public void reloadConfigs() {
        VFS vfs = new VFSImpl(CONFIGS_ROOT);
        configs.clear();

        for (String fileName: vfs.iterate(CONFIGS_ROOT)) {
            if (!vfs.isDirectory(fileName)) {
                try {
                    Map<String, String> config = DOMParser.parse(vfs.getUTF8Text(fileName));
                    configs.put(vfs.getFileName(fileName), config);
                } catch (ParserException | IOException e) {
                    System.err.println("Unable to load config: " + fileName);
                    e.printStackTrace();
                }
            }
        }
    }
}
