package com.formbuilder.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "components")
@Inheritance(strategy = InheritanceType.JOINED)
public class Component {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String componentType; // e.g., "TEXT_INPUT", "CHECKBOX_GROUP"
    private String label;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Lob // For potentially large JSON string
    private String attributes; // Store component-specific attributes as JSON

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id")
    @JsonBackReference("page-components")
    private Page page;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_component_id")
    @JsonBackReference("parent-child")
    private Component parentComponent;

    @OneToMany(mappedBy = "parentComponent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("parent-child")
    @OrderBy("orderIndex ASC")
    private List<Component> childComponents = new ArrayList<>();

    // Constructors
    public Component() {
    }

    public Component(String componentType, String label, String attributes) {
        this.componentType = componentType;
        this.label = label;
        this.attributes = attributes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getAttributes() {
        return attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
    }

    public Component getParentComponent() {
        return parentComponent;
    }

    public void setParentComponent(Component parentComponent) {
        this.parentComponent = parentComponent;
    }

    public List<Component> getChildComponents() {
        return childComponents;
    }

    public void setChildComponents(List<Component> childComponents) {
        this.childComponents = childComponents;
    }

    // Helper methods for managing child components
    public void addChildComponent(Component child) {
        childComponents.add(child);
        child.setParentComponent(this);
    }

    public void removeChildComponent(Component child) {
        childComponents.remove(child);
        child.setParentComponent(null);
    }
}
