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
import java.util.Map;

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

        existingPage.setName(pageDetails.getName());
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

    // ===== REORDER OPERATION (SIMPLIFIED - NO LONGER BASED ON PAGE NUMBERS) =====

    @PutMapping("/forms/{formId}/pages/reorder")
    public ResponseEntity<List<Page>> reorderPages(@PathVariable Long formId, @RequestBody Map<String, List<Long>> reorderData) {
        if (!formRepository.existsById(formId)) {
            throw new FormNotFoundException("Form not found with id: " + formId);
        }

        List<Long> pageIds = reorderData.get("pageIds");
        if (pageIds == null || pageIds.isEmpty()) {
            throw new IllegalArgumentException("pageIds array is required");
        }

        // Update the orderIndex for each page based on the new order
        for (int i = 0; i < pageIds.size(); i++) {
            Long pageId = pageIds.get(i);
            Page page = pageRepository.findById(pageId)
                    .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + pageId));
            page.setOrderIndex(i);
            pageRepository.save(page);
        }

        // Return the pages in the new order
        List<Page> reorderedPages = pageIds.stream()
                .map(id -> pageRepository.findById(id)
                        .orElseThrow(() -> new PageNotFoundException("Page not found with id: " + id)))
                .toList();

        return new ResponseEntity<>(reorderedPages, HttpStatus.OK);
    }
}
