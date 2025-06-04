package com.formbuilder.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formbuilder.backend.exceptions.FormNotFoundException;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.repositories.FormRepository;
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

@WebMvcTest(FormController.class)
public class FormControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FormRepository formRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void whenCreateForm_thenReturnCreatedForm() throws Exception {
        Form form = new Form("Test Form", "Description");
        Form savedForm = new Form("Test Form", "Description");
        savedForm.setId(1L);

        given(formRepository.save(any(Form.class))).willReturn(savedForm);

        mockMvc.perform(post("/api/forms/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Form")));
    }

    @Test
    public void whenGetAllForms_thenReturnFormList() throws Exception {
        Form form1 = new Form("Form 1", "Desc 1");
        form1.setId(1L);
        Form form2 = new Form("Form 2", "Desc 2");
        form2.setId(2L);
        List<Form> forms = Arrays.asList(form1, form2);

        given(formRepository.findAll()).willReturn(forms);

        mockMvc.perform(get("/api/forms/")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Form 1")))
                .andExpect(jsonPath("$[1].name", is("Form 2")));
    }

    @Test
    public void whenGetFormById_givenExistingId_thenReturnForm() throws Exception {
        Form form = new Form("Test Form", "Description");
        form.setId(1L);

        given(formRepository.findById(1L)).willReturn(Optional.of(form));

        mockMvc.perform(get("/api/forms/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Form")));
    }

    @Test
    public void whenGetFormById_givenNonExistentId_thenReturnNotFound() throws Exception {
        given(formRepository.findById(99L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/forms/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Form not found with id: 99")));
    }

    @Test
    public void whenUpdateForm_givenExistingId_thenReturnUpdatedForm() throws Exception {
        Form existingForm = new Form("Old Name", "Old Desc");
        existingForm.setId(1L);
        Form formDetails = new Form("New Name", "New Desc");
        Form updatedForm = new Form("New Name", "New Desc");
        updatedForm.setId(1L);

        given(formRepository.findById(1L)).willReturn(Optional.of(existingForm));
        given(formRepository.save(any(Form.class))).willReturn(updatedForm);

        mockMvc.perform(put("/api/forms/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("New Name")))
                .andExpect(jsonPath("$.description", is("New Desc")));
    }

    @Test
    public void whenUpdateForm_givenNonExistentId_thenReturnNotFound() throws Exception {
        Form formDetails = new Form("New Name", "New Desc");
        given(formRepository.findById(99L)).willReturn(Optional.empty());

        mockMvc.perform(put("/api/forms/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formDetails)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Form not found with id: 99")));
    }

    @Test
    public void whenDeleteForm_givenExistingId_thenReturnNoContent() throws Exception {
        when(formRepository.existsById(1L)).thenReturn(true);
        doNothing().when(formRepository).deleteById(1L);

        mockMvc.perform(delete("/api/forms/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void whenDeleteForm_givenNonExistentId_thenReturnNotFound() throws Exception {
        when(formRepository.existsById(99L)).thenReturn(false);
        // Simulate the behavior that deleteById might throw an error or rely on existsById check

        mockMvc.perform(delete("/api/forms/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Form not found with id: 99")));
    }
}
