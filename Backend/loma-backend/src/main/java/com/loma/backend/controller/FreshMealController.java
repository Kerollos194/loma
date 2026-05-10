package com.loma.backend.controller;

import com.loma.backend.entity.FreshMeal;
import com.loma.backend.service.MealService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals/fresh")
@CrossOrigin(origins = "*")
public class FreshMealController {

    private final MealService mealService;

    public FreshMealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public List<FreshMeal> getAll() {
        return mealService.getAllFresh();
    }

    @PostMapping
    public ResponseEntity<FreshMeal> create(@RequestBody FreshMeal meal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mealService.saveFresh(meal));
    }
}
