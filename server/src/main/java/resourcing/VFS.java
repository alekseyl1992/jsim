package resourcing;

import java.io.IOException;

public interface VFS {
    boolean isExist(String path);
    boolean isDirectory(String path);
    String getAbsolutePath(String file);
    String getFileName(String path);
    byte[] getBytes(String file) throws IOException;
    String getUTF8Text(String file) throws IOException;
    Iterable<String> iterate(String startDir);
}
