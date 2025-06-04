package com.formbuilder.backend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forms")
@NamedEntityGraph(
    name = "form-with-pages-and-components",
    attributeNodes = {
        @NamedAttributeNode(value = "pages", subgraph = "pages-subgraph")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "pages-subgraph",
            attributeNodes = {
                @NamedAttributeNode(value = "components", subgraph = "components-subgraph")
            }
        ),
        @NamedSubgraph(
            name = "components-subgraph",
            attributeNodes = {
                // Eagerly fetch childComponents of each component.
                // This assumes 'childComponents' is the name of the field in Component.java
                @NamedAttributeNode(value = "childComponents")
            }
        )
    }
)
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Page> pages = new ArrayList<>();

    // Constructors
    public Form() {
    }

    public Form(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Page> getPages() {
        return pages;
    }

    public void setPages(List<Page> pages) {
        this.pages = pages;
    }

    // Helper methods for managing pages
    public void addPage(Page page) {
        pages.add(page);
        page.setForm(this);
    }

    public void removePage(Page page) {
        pages.remove(page);
        page.setForm(null);
    }
}
