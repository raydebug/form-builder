package com.formbuilder.backend.controllers;

import com.formbuilder.backend.exceptions.FormNotFoundException;
import com.formbuilder.backend.exceptions.PageNotFoundException;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.FormRepository;
import com.formbuilder.backend.repositories.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PageController {

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private FormRepository formRepository;

    @PostMapping("/forms/{formId}/pages")
    public ResponseEntity<Page> createPage(@PathVariable Long formId, @RequestBody Page page) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with id: " + formId));
        page.setForm(form);
        Page savedPage = pageRepository.save(page);
        return new ResponseEntity<>(savedPage, HttpStatus.CREATED);
    }

    @GetMapping("/forms/{formId}/pages")
    public ResponseEntity<List<Page>> getAllPagesForForm(@PathVariable Long formId) {
        if (!formRepository.existsById(formId)) {
            throw new FormNotFoundException("Form not found with id: " + formId);
        }
        List<Page> pages = pageRepository.findByFormId(formId); // Assuming findByFormId exists or is added
        return new ResponseEntity<>(pages, HttpStatus.OK);
    }

    @GetMapping("/pages/{pageId}")
    public ResponseEntity<Page> getPageById(@PathVariable Long pageId) {
        Page page = pageRepository.findById(pageId)
                .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + pageId));
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PutMapping("/pages/{pageId}")
    public ResponseEntity<Page> updatePage(@PathVariable Long pageId, @RequestBody Page pageDetails) {
        Page existingPage = pageRepository.findById(pageId)
                .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + pageId));

        existingPage.setPageNumber(pageDetails.getPageNumber());
        // existingPage.setComponents(pageDetails.getComponents()); // If updating components directly

        Page updatedPage = pageRepository.save(existingPage);
        return new ResponseEntity<>(updatedPage, HttpStatus.OK);
    }

    @DeleteMapping("/pages/{pageId}")
    public ResponseEntity<HttpStatus> deletePage(@PathVariable Long pageId) {
        if (!pageRepository.existsById(pageId)) {
            throw new PageNotFoundException("Page not found with id: " + pageId);
        }
        pageRepository.deleteById(pageId); // orphanRemoval=true should handle components
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
