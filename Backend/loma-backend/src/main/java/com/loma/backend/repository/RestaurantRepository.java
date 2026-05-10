package com.loma.backend.repository;

import com.loma.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByIsApprovedTrue();
    List<Restaurant> findByUserUserId(Integer userId);
}
