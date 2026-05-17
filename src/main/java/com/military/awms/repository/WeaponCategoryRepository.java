package com.military.awms.repository;

import com.military.awms.model.WeaponCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WeaponCategoryRepository extends JpaRepository<WeaponCategory, Long> {
    Optional<WeaponCategory> findByName(String name);
}
