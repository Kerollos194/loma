package com.loma.backend.repository;

import com.loma.backend.entity.FreshMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreshMealRepository extends JpaRepository<FreshMeal, Integer> {
    List<FreshMeal> findByRestaurantRestaurantId(Integer restaurantId);
    List<FreshMeal> findByIsAvailableTrue();
    List<FreshMeal> findByCategoryCategoryId(Integer categoryId);
}
