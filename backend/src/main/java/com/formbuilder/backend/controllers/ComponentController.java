package com.formbuilder.backend.controllers;

import com.formbuilder.backend.exceptions.ComponentNotFoundException;
import com.formbuilder.backend.exceptions.PageNotFoundException;
import com.formbuilder.backend.models.Component;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.ComponentRepository;
import com.formbuilder.backend.repositories.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ComponentController {

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private PageRepository pageRepository;

    @PostMapping("/pages/{pageId}/components")
    public ResponseEntity<Component> createComponentInPage(@PathVariable Long pageId, @RequestBody Component component) {
        Page page = pageRepository.findById(pageId)
                .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + pageId));
        component.setPage(page);
        Component savedComponent = componentRepository.save(component);
        return new ResponseEntity<>(savedComponent, HttpStatus.CREATED);
    }

    @PostMapping("/components/{parentComponentId}/components")
    public ResponseEntity<Component> createNestedComponent(@PathVariable Long parentComponentId, @RequestBody Component component) {
        Component parentComponent = componentRepository.findById(parentComponentId)
                .orElseThrow(() -> new ComponentNotFoundException("Parent component not found with id: " + parentComponentId));

        // Associate with the same page as the parent
        component.setPage(parentComponent.getPage());
        component.setParentComponent(parentComponent);
        // parentComponent.addChildComponent(component); // Already handled by setting parentComponent? JPA should manage this.

        Component savedComponent = componentRepository.save(component);
        return new ResponseEntity<>(savedComponent, HttpStatus.CREATED);
    }

    @GetMapping("/pages/{pageId}/components")
    public ResponseEntity<List<Component>> getAllComponentsForPage(@PathVariable Long pageId) {
        if (!pageRepository.existsById(pageId)) {
            throw new PageNotFoundException("Page not found with id: " + pageId);
        }
        // Filter components that are direct children of the page (not nested)
        List<Component> components = componentRepository.findByPageIdAndParentComponentIsNull(pageId);
        return new ResponseEntity<>(components, HttpStatus.OK);
    }

    @GetMapping("/components/{parentComponentId}/components")
    public ResponseEntity<List<Component>> getAllChildComponents(@PathVariable Long parentComponentId) {
        if (!componentRepository.existsById(parentComponentId)) {
            throw new ComponentNotFoundException("Parent component not found with id: " + parentComponentId);
        }
        List<Component> components = componentRepository.findByParentComponentId(parentComponentId);
        return new ResponseEntity<>(components, HttpStatus.OK);
    }


    @GetMapping("/components/{componentId}")
    public ResponseEntity<Component> getComponentById(@PathVariable Long componentId) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + componentId));
        return new ResponseEntity<>(component, HttpStatus.OK);
    }

    @PutMapping("/components/{componentId}")
    public ResponseEntity<Component> updateComponent(@PathVariable Long componentId, @RequestBody Component componentDetails) {
        Component existingComponent = componentRepository.findById(componentId)
                .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + componentId));

        existingComponent.setComponentType(componentDetails.getComponentType());
        existingComponent.setLabel(componentDetails.getLabel());
        existingComponent.setAttributes(componentDetails.getAttributes());
        // Note: Changing parentComponent or page might be complex and require specific business logic

        Component updatedComponent = componentRepository.save(existingComponent);
        return new ResponseEntity<>(updatedComponent, HttpStatus.OK);
    }

    @DeleteMapping("/components/{componentId}")
    public ResponseEntity<HttpStatus> deleteComponent(@PathVariable Long componentId) {
        if (!componentRepository.existsById(componentId)) {
            throw new ComponentNotFoundException("Component not found with id: " + componentId);
        }
        componentRepository.deleteById(componentId); // orphanRemoval should handle child components
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
