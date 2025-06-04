package com.formbuilder.backend.repositories;

import com.formbuilder.backend.models.Form;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    @Override
    @EntityGraph(value = "form-with-pages-and-components", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Form> findById(Long id);
}
