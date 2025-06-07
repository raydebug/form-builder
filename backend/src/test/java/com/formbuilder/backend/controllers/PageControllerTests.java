package com.formbuilder.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.FormRepository;
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

@WebMvcTest(PageController.class)
public class PageControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PageRepository pageRepository;

    @MockBean
    private FormRepository formRepository; // Also mock FormRepository due to its use in PageController

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void whenCreatePage_givenValidFormId_thenReturnCreatedPage() throws Exception {
        Form form = new Form("Test Form", "Form Description");
        form.setId(1L);
        Page page = new Page("Home Page");
        Page savedPage = new Page("Home Page");
        savedPage.setId(10L);
        savedPage.setForm(form);

        given(formRepository.findById(1L)).willReturn(Optional.of(form));
        given(pageRepository.save(any(Page.class))).willReturn(savedPage);

        mockMvc.perform(post("/api/forms/1/pages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(page)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.name", is("Home Page")));
    }

    @Test
    public void whenCreatePage_givenInvalidFormId_thenReturnNotFound() throws Exception {
        Page page = new Page("Home Page");
        given(formRepository.findById(99L)).willReturn(Optional.empty());

        mockMvc.perform(post("/api/forms/99/pages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(page)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Form not found with id: 99")));
    }

    @Test
    public void whenGetAllPagesForForm_givenValidFormId_thenReturnPageList() throws Exception {
        Form form = new Form();
        form.setId(1L);
        Page page1 = new Page("Home Page");
        page1.setId(10L);
        page1.setForm(form);
        Page page2 = new Page("Contact Page");
        page2.setId(11L);
        page2.setForm(form);
        List<Page> pages = Arrays.asList(page1, page2);

        given(formRepository.existsById(1L)).willReturn(true);
        given(pageRepository.findByFormId(1L)).willReturn(pages);

        mockMvc.perform(get("/api/forms/1/pages")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Home Page")))
                .andExpect(jsonPath("$[1].name", is("Contact Page")));
    }

    @Test
    public void whenGetAllPagesForForm_givenInvalidFormId_thenReturnNotFound() throws Exception {
        given(formRepository.existsById(99L)).willReturn(false);

        mockMvc.perform(get("/api/forms/99/pages")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Form not found with id: 99")));
    }


    @Test
    public void whenGetPageById_givenExistingId_thenReturnPage() throws Exception {
        Page page = new Page("Home Page");
        page.setId(10L);
        given(pageRepository.findById(10L)).willReturn(Optional.of(page));

        mockMvc.perform(get("/api/pages/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)));
    }

    @Test
    public void whenGetPageById_givenNonExistentId_thenReturnNotFound() throws Exception {
        given(pageRepository.findById(99L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/pages/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Page not found with id: 99")));
    }

    @Test
    public void whenUpdatePage_givenExistingId_thenReturnUpdatedPage() throws Exception {
        Page existingPage = new Page("Home Page");
        existingPage.setId(10L);
        Page pageDetails = new Page("Updated Home Page"); // updated page name
        Page updatedPage = new Page("Updated Home Page");
        updatedPage.setId(10L);

        given(pageRepository.findById(10L)).willReturn(Optional.of(existingPage));
        given(pageRepository.save(any(Page.class))).willReturn(updatedPage);

        mockMvc.perform(put("/api/pages/10")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pageDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Home Page")));
    }

    @Test
    public void whenDeletePage_givenExistingId_thenReturnNoContent() throws Exception {
        when(pageRepository.existsById(10L)).thenReturn(true);
        doNothing().when(pageRepository).deleteById(10L);

        mockMvc.perform(delete("/api/pages/10"))
                .andExpect(status().isNoContent());
    }
}
