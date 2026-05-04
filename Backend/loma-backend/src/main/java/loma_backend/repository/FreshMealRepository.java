package loma_backend.repository;

import loma_backend.entity.FreshMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreshMealRepository extends JpaRepository<FreshMeal, Integer> {
    List<FreshMeal> findByIsAvailableTrue();
    List<FreshMeal> findByRestaurantRestaurantId(Integer restaurantId);
    List<FreshMeal> findByCategoryCategoryId(Integer categoryId);
}