package resourcing;

import java.io.File;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;

public class VFSIterator implements Iterator<String>, Iterable<String> {
    private Queue<File> files = new LinkedList<>();

    public VFSIterator(String path){
        files.add(new File(path));
    }

    @Override
    public boolean hasNext() {
        return !files.isEmpty();
    }

    @Override
    public String next() {
        File file = files.peek();

        if(file.isDirectory()) {
            File[] filesInDirectory = file.listFiles();
            if (filesInDirectory != null)
                Collections.addAll(files, filesInDirectory);
        }
        return files.poll().getAbsolutePath();
    }

    @Override
    public void remove() {
    }

    @Override
    public Iterator<String> iterator() {
        return this;
    }
}
