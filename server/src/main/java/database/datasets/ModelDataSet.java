package database.datasets;

import database.Util;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "models")
public class ModelDataSet implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "author_id")
    private long authorId;

    @Column(name="name")
    private String name;

    @Column(name="data")
    private String data;

    public ModelDataSet() {

    }

    public ModelDataSet(long authorId, String name, String data) {
        this.id = Util.UNSPECIFIED_ID;
        this.authorId = authorId;
        this.name = name;
        this.data = data;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(long authorId) {
        this.authorId = authorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}

