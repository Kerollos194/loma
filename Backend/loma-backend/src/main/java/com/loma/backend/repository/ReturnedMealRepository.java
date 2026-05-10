package com.loma.backend.repository;

import com.loma.backend.entity.ReturnedMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReturnedMealRepository extends JpaRepository<ReturnedMeal, Integer> {
    List<ReturnedMeal> findByStatus(String status);
    List<ReturnedMeal> findByRestaurantRestaurantId(Integer restaurantId);
}
