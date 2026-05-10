package com.loma.backend.controller;

import com.loma.backend.entity.Restaurant;
import com.loma.backend.repository.RestaurantRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantRepository restaurantRepo;

    public RestaurantController(RestaurantRepository restaurantRepo) {
        this.restaurantRepo = restaurantRepo;
    }

    @GetMapping
    public List<Restaurant> getApproved() {
        return restaurantRepo.findByIsApprovedTrue();
    }
}
