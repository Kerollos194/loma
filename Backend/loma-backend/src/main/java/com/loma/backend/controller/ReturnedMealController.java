package com.loma.backend.controller;

import com.loma.backend.entity.ReturnedMeal;
import com.loma.backend.service.MealService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals/returned")
@CrossOrigin(origins = "*")
public class ReturnedMealController {

    private final MealService mealService;

    public ReturnedMealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public List<ReturnedMeal> getAll() {
        return mealService.getAllReturned();
    }

    @PostMapping
    public ResponseEntity<ReturnedMeal> create(@RequestBody ReturnedMeal meal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mealService.saveReturned(meal));
    }
}
