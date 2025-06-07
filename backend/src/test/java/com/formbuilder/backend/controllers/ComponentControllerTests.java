package com.formbuilder.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formbuilder.backend.models.Component;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.ComponentRepository;
import com.formbuilder.backend.repositories.PageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

@WebMvcTest(ComponentController.class)
public class ComponentControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComponentRepository componentRepository;

    @MockBean
    private PageRepository pageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void whenCreateComponentInPage_givenValidPageId_thenReturnCreatedComponent() throws Exception {
        Page page = new Page("Home Page");
        page.setId(1L);
        Component component = new Component("TEXT_INPUT", "Name", "{}");
        Component savedComponent = new Component("TEXT_INPUT", "Name", "{}");
        savedComponent.setId(100L);
        savedComponent.setPage(page);

        given(pageRepository.findById(1L)).willReturn(Optional.of(page));
        given(componentRepository.save(any(Component.class))).willReturn(savedComponent);

        mockMvc.perform(post("/api/pages/1/components")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(component)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(100)))
                .andExpect(jsonPath("$.label", is("Name")));
    }

    @Test
    public void whenCreateNestedComponent_givenValidParentId_thenReturnCreatedComponent() throws Exception {
        Component parentComponent = new Component("CONTAINER", "Parent", "{}");
        parentComponent.setId(100L);
        Page page = new Page("Home Page");
        page.setId(1L);
        parentComponent.setPage(page); // Parent component must be associated with a page

        Component childComponent = new Component("TEXT_INPUT", "Child", "{}");
        Component savedChildComponent = new Component("TEXT_INPUT", "Child", "{}");
        savedChildComponent.setId(101L);
        savedChildComponent.setParentComponent(parentComponent);
        savedChildComponent.setPage(page);


        given(componentRepository.findById(100L)).willReturn(Optional.of(parentComponent));
        given(componentRepository.save(any(Component.class))).willReturn(savedChildComponent);

        mockMvc.perform(post("/api/components/100/components")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(childComponent)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(101)))
                .andExpect(jsonPath("$.label", is("Child")));
    }


    @Test
    public void whenGetAllComponentsForPage_givenValidPageId_thenReturnComponentList() throws Exception {
        Page page = new Page();
        page.setId(1L);
        Component component1 = new Component("TEXT_INPUT", "Comp1", "{}");
        component1.setId(100L);
        component1.setPage(page);
        Component component2 = new Component("CHECKBOX", "Comp2", "{}");
        component2.setId(101L);
        component2.setPage(page);
        List<Component> components = Arrays.asList(component1, component2);

        given(pageRepository.existsById(1L)).willReturn(true);
        given(componentRepository.findByPageIdAndParentComponentIsNull(1L)).willReturn(components);

        mockMvc.perform(get("/api/pages/1/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].label", is("Comp1")));
    }

    @Test
    public void whenGetAllChildComponents_givenValidParentId_thenReturnChildComponentList() throws Exception {
        Component parent = new Component();
        parent.setId(100L);
        Component child1 = new Component("TEXT_INPUT", "Child1", "{}");
        child1.setId(101L);
        child1.setParentComponent(parent);
         List<Component> childComponents = Arrays.asList(child1);

        given(componentRepository.existsById(100L)).willReturn(true);
        given(componentRepository.findByParentComponentId(100L)).willReturn(childComponents);

        mockMvc.perform(get("/api/components/100/components"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].label", is("Child1")));
    }


    @Test
    public void whenGetComponentById_givenExistingId_thenReturnComponent() throws Exception {
        Component component = new Component("TEXT_INPUT", "My Component", "{}");
        component.setId(100L);
        given(componentRepository.findById(100L)).willReturn(Optional.of(component));

        mockMvc.perform(get("/api/components/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.label", is("My Component")));
    }

    @Test
    public void whenDeleteComponent_givenExistingId_thenReturnNoContent() throws Exception {
        when(componentRepository.existsById(100L)).thenReturn(true);
        doNothing().when(componentRepository).deleteById(100L);

        mockMvc.perform(delete("/api/components/100"))
                .andExpect(status().isNoContent());
    }
}
