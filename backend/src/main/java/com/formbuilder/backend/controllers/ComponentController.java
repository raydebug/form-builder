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
import java.util.Map;

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

    // ===== NEW: MOVE AND REORDER OPERATIONS =====

    @PutMapping("/components/{componentId}/move")
    public ResponseEntity<Component> moveComponent(@PathVariable Long componentId, @RequestBody Map<String, Object> moveData) {
        Component component = componentRepository.findById(componentId)
                .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + componentId));

        // Get target page and parent component from request
        Long targetPageId = moveData.get("targetPageId") != null ? 
            Long.valueOf(moveData.get("targetPageId").toString()) : null;
        Long targetParentComponentId = moveData.get("targetParentComponentId") != null ? 
            Long.valueOf(moveData.get("targetParentComponentId").toString()) : null;

        // Move to different page
        if (targetPageId != null) {
            Page targetPage = pageRepository.findById(targetPageId)
                    .orElseThrow(() -> new PageNotFoundException("Target page not found with id: " + targetPageId));
            component.setPage(targetPage);
        }

        // Move to different parent component (or make it a root component)
        if (targetParentComponentId != null) {
            Component targetParent = componentRepository.findById(targetParentComponentId)
                    .orElseThrow(() -> new ComponentNotFoundException("Target parent component not found with id: " + targetParentComponentId));
            component.setParentComponent(targetParent);
            // Also ensure it's on the same page as the parent
            component.setPage(targetParent.getPage());
        } else if (moveData.containsKey("targetParentComponentId")) {
            // Explicitly setting to null (making it a root component)
            component.setParentComponent(null);
        }

        Component movedComponent = componentRepository.save(component);
        return new ResponseEntity<>(movedComponent, HttpStatus.OK);
    }

    @PutMapping("/pages/{pageId}/components/reorder")
    public ResponseEntity<List<Component>> reorderComponentsInPage(@PathVariable Long pageId, @RequestBody Map<String, List<Long>> reorderData) {
        if (!pageRepository.existsById(pageId)) {
            throw new PageNotFoundException("Page not found with id: " + pageId);
        }

        List<Long> componentIds = reorderData.get("componentIds");
        if (componentIds == null || componentIds.isEmpty()) {
            throw new IllegalArgumentException("componentIds array is required");
        }

        // Update the orderIndex for each component based on the new order
        for (int i = 0; i < componentIds.size(); i++) {
            Long componentId = componentIds.get(i);
            Component component = componentRepository.findById(componentId)
                    .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + componentId));
            component.setOrderIndex(i);
            componentRepository.save(component);
        }

        // Return the components in the new order
        List<Component> reorderedComponents = componentIds.stream()
                .map(id -> componentRepository.findById(id)
                        .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + id)))
                .toList();

        return new ResponseEntity<>(reorderedComponents, HttpStatus.OK);
    }

    @PutMapping("/components/{parentComponentId}/components/reorder")
    public ResponseEntity<List<Component>> reorderNestedComponents(@PathVariable Long parentComponentId, @RequestBody Map<String, List<Long>> reorderData) {
        if (!componentRepository.existsById(parentComponentId)) {
            throw new ComponentNotFoundException("Parent component not found with id: " + parentComponentId);
        }

        List<Long> componentIds = reorderData.get("componentIds");
        if (componentIds == null || componentIds.isEmpty()) {
            throw new IllegalArgumentException("componentIds array is required");
        }

        // Update the orderIndex for each nested component based on the new order
        for (int i = 0; i < componentIds.size(); i++) {
            Long componentId = componentIds.get(i);
            Component component = componentRepository.findById(componentId)
                    .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + componentId));
            component.setOrderIndex(i);
            componentRepository.save(component);
        }

        // Return the components in the new order
        List<Component> reorderedComponents = componentIds.stream()
                .map(id -> componentRepository.findById(id)
                        .orElseThrow(() -> new ComponentNotFoundException("Component not found with id: " + id)))
                .toList();

        return new ResponseEntity<>(reorderedComponents, HttpStatus.OK);
    }
}
