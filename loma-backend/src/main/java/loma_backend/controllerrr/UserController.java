// ============================================================
// UserController.java  —  /api/users
// ============================================================
package loma_backend.controller;

import loma_backend.entity.User;
import loma_backend.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // GET all users
    @GetMapping
    public List<User> getAll() {
        return userRepo.findAll();
    }

    // GET user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id) {
        return userRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        // TODO: hash password with BCrypt before saving
        User saved = userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // POST login (simple — no JWT yet)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return userRepo.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    // TODO: compare BCrypt hash
                    if (user.getPasswordHash().equals(loginRequest.getPasswordHash())) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong password");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}


// ============================================================
// RestaurantController.java  —  /api/restaurants
// ============================================================
package loma_backend.controller;

import loma_backend.entity.Restaurant;
import loma_backend.repository.RestaurantRepository;
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

    // GET all approved restaurants
    @GetMapping
    public List<Restaurant> getApproved() {
        return restaurantRepo.findByIsApprovedTrue();
    }

    // GET restaurant by id
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getById(@PathVariable Integer id) {
        return restaurantRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET restaurants by user
    @GetMapping("/user/{userId}")
    public List<Restaurant> getByUser(@PathVariable Integer userId) {
        return restaurantRepo.findByUserUserId(userId);
    }

    // POST create restaurant
    @PostMapping
    public ResponseEntity<Restaurant> create(@RequestBody Restaurant restaurant) {
        Restaurant saved = restaurantRepo.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update restaurant
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> update(@PathVariable Integer id,
                                              @RequestBody Restaurant updated) {
        return restaurantRepo.findById(id).map(r -> {
            r.setName(updated.getName());
            r.setLogoUrl(updated.getLogoUrl());
            r.setPhone(updated.getPhone());
            return ResponseEntity.ok(restaurantRepo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}


// ============================================================
// CategoryController.java  —  /api/categories
// ============================================================
package loma_backend.controller;

import loma_backend.entity.Category;
import loma_backend.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepo;

    public CategoryController(CategoryRepository categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryRepo.findAll();
    }
}


// ============================================================
// FreshMealController.java  —  /api/meals/fresh
// ============================================================
package loma_backend.controller;

import loma_backend.entity.FreshMeal;
import loma_backend.repository.FreshMealRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals/fresh")
@CrossOrigin(origins = "*")
public class FreshMealController {

    private final FreshMealRepository freshMealRepo;

    public FreshMealController(FreshMealRepository freshMealRepo) {
        this.freshMealRepo = freshMealRepo;
    }

    // GET all available fresh meals
    @GetMapping
    public List<FreshMeal> getAll() {
        return freshMealRepo.findByIsAvailableTrue();
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<FreshMeal> getById(@PathVariable Integer id) {
        return freshMealRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET by restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<FreshMeal> getByRestaurant(@PathVariable Integer restaurantId) {
        return freshMealRepo.findByRestaurantRestaurantId(restaurantId);
    }

    // GET by category
    @GetMapping("/category/{categoryId}")
    public List<FreshMeal> getByCategory(@PathVariable Integer categoryId) {
        return freshMealRepo.findByCategoryCategoryId(categoryId);
    }

    // POST add new fresh meal
    @PostMapping
    public ResponseEntity<FreshMeal> create(@RequestBody FreshMeal meal) {
        FreshMeal saved = freshMealRepo.save(meal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update meal
    @PutMapping("/{id}")
    public ResponseEntity<FreshMeal> update(@PathVariable Integer id,
                                             @RequestBody FreshMeal updated) {
        return freshMealRepo.findById(id).map(m -> {
            m.setName(updated.getName());
            m.setDescription(updated.getDescription());
            m.setPrice(updated.getPrice());
            m.setImageUrl(updated.getImageUrl());
            m.setIsAvailable(updated.getIsAvailable());
            m.setCategory(updated.getCategory());
            return ResponseEntity.ok(freshMealRepo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE meal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!freshMealRepo.existsById(id)) return ResponseEntity.notFound().build();
        freshMealRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


// ============================================================
// ReturnedMealController.java  —  /api/meals/returned
// ============================================================
package loma_backend.controller;

import loma_backend.entity.ReturnedMeal;
import loma_backend.repository.ReturnedMealRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@RestController
@RequestMapping("/api/meals/returned")
@CrossOrigin(origins = "*")
public class ReturnedMealController {

    private final ReturnedMealRepository returnedMealRepo;

    public ReturnedMealController(ReturnedMealRepository returnedMealRepo) {
        this.returnedMealRepo = returnedMealRepo;
    }

    // GET all available returned meals
    @GetMapping
    public List<ReturnedMeal> getAvailable() {
        return returnedMealRepo.findByStatus("available");
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<ReturnedMeal> getById(@PathVariable Integer id) {
        return returnedMealRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET by restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<ReturnedMeal> getByRestaurant(@PathVariable Integer restaurantId) {
        return returnedMealRepo.findByRestaurantRestaurantId(restaurantId);
    }

    // POST add returned meal — final_price computed automatically
    @PostMapping
    public ResponseEntity<ReturnedMeal> create(@RequestBody ReturnedMeal meal) {
        // Auto-compute final_price = originalPrice * (1 - discount/100)
        BigDecimal discountFactor = BigDecimal.ONE
                .subtract(meal.getDiscount().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        meal.setFinalPrice(meal.getOriginalPrice().multiply(discountFactor)
                .setScale(2, RoundingMode.HALF_UP));

        ReturnedMeal saved = returnedMealRepo.save(meal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update status (available / sold / expired)
    @PutMapping("/{id}/status")
    public ResponseEntity<ReturnedMeal> updateStatus(@PathVariable Integer id,
                                                      @RequestParam String status) {
        return returnedMealRepo.findById(id).map(m -> {
            m.setStatus(status);
            return ResponseEntity.ok(returnedMealRepo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }
}


// ============================================================
// OrderController.java  —  /api/orders
// ============================================================
package loma_backend.controller;

import loma_backend.entity.*;
import loma_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepo;

    public OrderController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    // GET orders by user
    @GetMapping("/user/{userId}")
    public List<Order> getByUser(@PathVariable Integer userId) {
        return orderRepo.findByUserUserId(userId);
    }

    // GET order by id
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Integer id) {
        return orderRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST place new order
    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        // link each item back to the order
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        Order saved = orderRepo.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Integer id,
                                               @RequestParam String status) {
        return orderRepo.findById(id).map(o -> {
            o.setStatus(status);
            return ResponseEntity.ok(orderRepo.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }
}