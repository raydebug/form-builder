package com.formbuilder.backend.repositories;

import com.formbuilder.backend.models.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    List<Page> findByFormId(Long formId);
}
