// ============================================================
// UserRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}


// ============================================================
// RestaurantRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByIsApprovedTrue();
    List<Restaurant> findByUserUserId(Integer userId);
}


// ============================================================
// CategoryRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}


// ============================================================
// FreshMealRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.FreshMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreshMealRepository extends JpaRepository<FreshMeal, Integer> {
    List<FreshMeal> findByRestaurantRestaurantId(Integer restaurantId);
    List<FreshMeal> findByIsAvailableTrue();
    List<FreshMeal> findByCategoryCategoryId(Integer categoryId);
}


// ============================================================
// ReturnedMealRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.ReturnedMeal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReturnedMealRepository extends JpaRepository<ReturnedMeal, Integer> {
    List<ReturnedMeal> findByStatus(String status);
    List<ReturnedMeal> findByRestaurantRestaurantId(Integer restaurantId);
}


// ============================================================
// OrderRepository.java
// ============================================================
package loma_backend.repository;

import loma_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserUserId(Integer userId);
    List<Order> findByStatus(String status);
}