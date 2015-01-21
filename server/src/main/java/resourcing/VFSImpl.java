package resourcing;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class VFSImpl implements VFS {
    private String root;

    VFSImpl(String root) {
        this.root = root;
    }

    @Override
    public boolean isExist(String path) {
        return new File(getAbsolutePath(path)).exists();
    }

    @Override
    public boolean isDirectory(String path) {
        return new File(getAbsolutePath(path)).isDirectory();
    }

    @Override
    public String getAbsolutePath(String file) {
        if (Paths.get(file).isAbsolute())
            return file;
        else
            return Paths.get(root, file).toAbsolutePath().toString();
    }

    @Override
    public String getFileName(String path) {
        return Paths.get(path).getFileName().toString();
    }

    @Override
    public byte[] getBytes(String file) throws IOException {
        return Files.readAllBytes(Paths.get(getAbsolutePath(file)));
    }

    @Override
    public String getUTF8Text(String file) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();

        try (
            FileInputStream fs = new FileInputStream(getAbsolutePath(file));
            DataInputStream ds = new DataInputStream(fs);

            InputStreamReader isr = new InputStreamReader(ds, "UTF-8");
            BufferedReader br = new BufferedReader(isr)
        ) {
            String strLine;

            while ((strLine = br.readLine()) != null) {
                stringBuilder.append(strLine);
            }

            br.close();
        }

        return stringBuilder.toString();
    }

    @Override
    public Iterable<String> iterate(String startDir) {
        return new VFSIterator(startDir);
    }
}
