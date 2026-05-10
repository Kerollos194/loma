package com.loma.backend.service;

import com.loma.backend.entity.FreshMeal;
import com.loma.backend.entity.ReturnedMeal;
import com.loma.backend.repository.FreshMealRepository;
import com.loma.backend.repository.ReturnedMealRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class MealService {

    private final FreshMealRepository freshMealRepo;
    private final ReturnedMealRepository returnedMealRepo;

    public MealService(FreshMealRepository freshMealRepo, ReturnedMealRepository returnedMealRepo) {
        this.freshMealRepo = freshMealRepo;
        this.returnedMealRepo = returnedMealRepo;
    }

    // Fresh Meals
    public List<FreshMeal> getAllFresh() {
        return freshMealRepo.findByIsAvailableTrue();
    }

    public Optional<FreshMeal> findFreshById(Integer id) {
        return freshMealRepo.findById(id);
    }

    public FreshMeal saveFresh(FreshMeal meal) {
        return freshMealRepo.save(meal);
    }

    // Returned Meals
    public List<ReturnedMeal> getAllReturned() {
        return returnedMealRepo.findByStatus("available");
    }

    public ReturnedMeal saveReturned(ReturnedMeal meal) {
        // Auto-compute final_price
        BigDecimal discountFactor = BigDecimal.ONE
                .subtract(meal.getDiscount().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        meal.setFinalPrice(meal.getOriginalPrice().multiply(discountFactor)
                .setScale(2, RoundingMode.HALF_UP));
        
        return returnedMealRepo.save(meal);
    }
}
