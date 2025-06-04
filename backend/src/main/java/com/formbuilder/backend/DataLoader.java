package com.formbuilder.backend;

import com.formbuilder.backend.models.Component;
import com.formbuilder.backend.models.Form;
import com.formbuilder.backend.models.Page;
import com.formbuilder.backend.repositories.ComponentRepository;
import com.formbuilder.backend.repositories.FormRepository;
import com.formbuilder.backend.repositories.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component; // Corrected annotation

@Component // Corrected annotation
public class DataLoader implements CommandLineRunner {

    @Autowired
    FormRepository formRepository;

    @Autowired
    PageRepository pageRepository;

    @Autowired
    ComponentRepository componentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (formRepository.count() == 0) {
            Form form1 = new Form();
            form1.setName("Test Form 1");
            form1.setDescription("A default form for E2E testing.");
            // Note: Pages and components will be added to the form and then form saved,
            // or form saved first, then pages/components associated and saved.
            // For simplicity with cascading saves, let's add children before final top-level save.

            Page page1 = new Page();
            page1.setPageNumber(1);
            // form1.addPage(page1); // Associate page with form

            Component comp1 = new Component();
            comp1.setComponentType("TEXT_INPUT");
            comp1.setLabel("First Name");
            comp1.setAttributes("{\"placeholder\": \"Enter your first name\"}"); // Escaped JSON
            // page1.addComponent(comp1); // Associate component with page

            Component comp2 = new Component();
            comp2.setComponentType("TEXT_AREA");
            comp2.setLabel("Feedback");
            comp2.setAttributes("{\"rows\": 3}");
            // page1.addComponent(comp2);

            Component parentComp = new Component();
            parentComp.setComponentType("PANEL");
            parentComp.setLabel("Contact Info");
            // page1.addComponent(parentComp);

            Component childComp = new Component();
            childComp.setComponentType("EMAIL_INPUT");
            childComp.setLabel("Email");
            childComp.setAttributes("{\"required\": true}");
            // parentComp.addChildComponent(childComp); // Nest it

            // Save strategy: save parent entities first, or rely on cascade from the top.
            // To ensure associations are correctly managed by JPA and IDs are generated,
            // it's often better to save parent entities first, then children,
            // or set bi-directional relationships correctly and cascade persist.
            // Given our @OneToMany(cascade = CascadeType.ALL) this should work by saving the form.

            formRepository.save(form1); // Save form first to get an ID

            page1.setForm(form1); // Now set the form for the page
            pageRepository.save(page1); // Save page to get an ID

            comp1.setPage(page1);
            componentRepository.save(comp1);

            comp2.setPage(page1);
            componentRepository.save(comp2);

            parentComp.setPage(page1);
            componentRepository.save(parentComp); // Save parent component to get ID

            childComp.setPage(page1); // Child also belongs to the page directly in this model
            childComp.setParentComponent(parentComp); // Set parent component relationship
            componentRepository.save(childComp);

            // Verify (optional logging)
            System.out.println("DataLoader: Test Form 1 created with ID: " + form1.getId());
            System.out.println("DataLoader: Page 1 created with ID: " + page1.getId() + " for Form ID: " + form1.getId());
            System.out.println("DataLoader: Component 'First Name' created with ID: " + comp1.getId() + " for Page ID: " + page1.getId());
            System.out.println("DataLoader: Component 'Email' created with ID: " + childComp.getId() + " nested under Component ID: " + parentComp.getId());
        }
    }
}
