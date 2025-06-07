package com.formbuilder.backend;

import com.formbuilder.backend.models.Component;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.ComponentRepository;
import com.formbuilder.backend.repositories.FormRepository;
import com.formbuilder.backend.repositories.PageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test") // Optional: use a separate test profile if needed
class BackendApplicationTests {

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private ComponentRepository componentRepository;

    @Test
    void contextLoads() {
        assertThat(formRepository).isNotNull();
        assertThat(pageRepository).isNotNull();
        assertThat(componentRepository).isNotNull();
    }

    @Test
    void testCreateAndRetrieveFormWithPagesAndComponents() {
        // Create Form
        Form form = new Form("Test Form", "A form for testing purposes");

        // Create Page 1
        Page page1 = new Page("Personal Information");
        Component textInput = new Component("TEXT_INPUT", "Name", "{\"placeholder\": \"Enter your name\"}");
        page1.addComponent(textInput);
        form.addPage(page1);

        // Create Page 2
        Page page2 = new Page("Contact Details");
        Component checkboxGroup = new Component("CHECKBOX_GROUP", "Interests", "{\"options\": [\"Coding\", \"Reading\"]}");
        Component submitButton = new Component("BUTTON", "Submit", "{\"type\": \"submit\"}");
        page2.addComponent(checkboxGroup);
        page2.addComponent(submitButton);
        form.addPage(page2);

        // Create a nested component
        Component parentComponent = new Component("CONTAINER", "Address", "{}");
        Component streetInput = new Component("TEXT_INPUT", "Street", "{\"placeholder\": \"Enter street\"}");
        parentComponent.addChildComponent(streetInput);
        page1.addComponent(parentComponent);


        // Save Form (cascades to Pages and Components)
        Form savedForm = formRepository.save(form);
        assertThat(savedForm).isNotNull();
        assertThat(savedForm.getId()).isNotNull();
        assertThat(savedForm.getPages()).hasSize(2);

        // Retrieve and verify
        Form retrievedForm = formRepository.findById(savedForm.getId()).orElse(null);
        assertThat(retrievedForm).isNotNull();
        assertThat(retrievedForm.getName()).isEqualTo("Test Form");
        assertThat(retrievedForm.getPages()).hasSize(2);

        Page retrievedPage1 = retrievedForm.getPages().stream()
                .filter(p -> "Personal Information".equals(p.getName()))
                .findFirst().orElse(null);
        assertThat(retrievedPage1).isNotNull();
        assertThat(retrievedPage1.getComponents()).hasSize(2); // textInput and parentComponent

        Component retrievedTextInput = retrievedPage1.getComponents().stream()
                .filter(c -> "TEXT_INPUT".equals(c.getComponentType()) && "Name".equals(c.getLabel()))
                .findFirst().orElse(null);
        assertThat(retrievedTextInput).isNotNull();
        assertThat(retrievedTextInput.getAttributes()).isEqualTo("{\"placeholder\": \"Enter your name\"}");

        Component retrievedParentComponent = retrievedPage1.getComponents().stream()
            .filter(c -> "CONTAINER".equals(c.getComponentType()))
            .findFirst().orElse(null);
        assertThat(retrievedParentComponent).isNotNull();
        assertThat(retrievedParentComponent.getChildComponents()).hasSize(1);

        Component retrievedStreetInput = retrievedParentComponent.getChildComponents().get(0);
        assertThat(retrievedStreetInput).isNotNull();
        assertThat(retrievedStreetInput.getComponentType()).isEqualTo("TEXT_INPUT");
        assertThat(retrievedStreetInput.getLabel()).isEqualTo("Street");


        Page retrievedPage2 = retrievedForm.getPages().stream()
                .filter(p -> "Contact Details".equals(p.getName()))
                .findFirst().orElse(null);
        assertThat(retrievedPage2).isNotNull();
        assertThat(retrievedPage2.getComponents()).hasSize(2); // checkboxGroup and submitButton
    }
}
