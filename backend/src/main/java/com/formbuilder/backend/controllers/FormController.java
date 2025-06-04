package com.formbuilder.backend.controllers;

import com.formbuilder.backend.exceptions.FormNotFoundException;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.repositories.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
public class FormController {

    @Autowired
    private FormRepository formRepository;

    @PostMapping("/")
    public ResponseEntity<Form> createForm(@RequestBody Form form) {
        Form savedForm = formRepository.save(form);
        return new ResponseEntity<>(savedForm, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<Form>> getAllForms() {
        List<Form> forms = formRepository.findAll();
        return new ResponseEntity<>(forms, HttpStatus.OK);
    }

    @GetMapping("/{formId}")
    public ResponseEntity<Form> getFormById(@PathVariable Long formId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with id: " + formId));
        return new ResponseEntity<>(form, HttpStatus.OK);
    }

    @PutMapping("/{formId}")
    public ResponseEntity<Form> updateForm(@PathVariable Long formId, @RequestBody Form formDetails) {
        Form existingForm = formRepository.findById(formId)
                .orElseThrow(() -> new FormNotFoundException("Form not found with id: " + formId));

        existingForm.setName(formDetails.getName());
        existingForm.setDescription(formDetails.getDescription());
        // Potentially update pages as well, if the Form request body includes them
        // For now, keeping it simple and only updating name and description
        // existingForm.setPages(formDetails.getPages());


        Form updatedForm = formRepository.save(existingForm);
        return new ResponseEntity<>(updatedForm, HttpStatus.OK);
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<HttpStatus> deleteForm(@PathVariable Long formId) {
        if (!formRepository.existsById(formId)) {
            throw new FormNotFoundException("Form not found with id: " + formId);
        }
        formRepository.deleteById(formId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
