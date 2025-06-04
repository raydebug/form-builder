package com.formbuilder.backend.repositories;

import com.formbuilder.backend.models.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentRepository extends JpaRepository<Component, Long> {
    List<Component> findByPageIdAndParentComponentIsNull(Long pageId);
    List<Component> findByParentComponentId(Long parentComponentId);
}
