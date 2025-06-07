package com.formbuilder.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.repositories.FormRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FormController.class)
class FormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FormRepository formRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Form testForm;

    @BeforeEach
    void setUp() {
        testForm = new Form("Test Form", "Test Description");
        testForm.setId(1L);
    }

    @Test
    void getAllForms_ShouldReturnFormsList() throws Exception {
        when(formRepository.findAll()).thenReturn(Arrays.asList(testForm));

        mockMvc.perform(get("/api/forms/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Form"))
                .andExpect(jsonPath("$[0].description").value("Test Description"));
    }

    @Test
    void getFormById_ShouldReturnForm_WhenFormExists() throws Exception {
        when(formRepository.findById(1L)).thenReturn(Optional.of(testForm));

        mockMvc.perform(get("/api/forms/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Form"));
    }

    @Test
    void createForm_ShouldReturnCreatedForm() throws Exception {
        Form newForm = new Form("New Form", "New Description");
        Form savedForm = new Form("New Form", "New Description");
        savedForm.setId(2L);

        when(formRepository.save(any(Form.class))).thenReturn(savedForm);

        mockMvc.perform(post("/api/forms/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newForm)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").value("New Form"));
    }

    @Test
    void updateForm_ShouldReturnUpdatedForm_WhenFormExists() throws Exception {
        Form updatedFormData = new Form("Updated Form", "Updated Description");
        Form updatedForm = new Form("Updated Form", "Updated Description");
        updatedForm.setId(1L);

        when(formRepository.findById(1L)).thenReturn(Optional.of(testForm));
        when(formRepository.save(any(Form.class))).thenReturn(updatedForm);

        mockMvc.perform(put("/api/forms/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedFormData)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Updated Form"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    void deleteForm_ShouldReturnNoContent_WhenFormExists() throws Exception {
        when(formRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/forms/1"))
                .andExpect(status().isNoContent());
    }
} 