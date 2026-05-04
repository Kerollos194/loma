package loma_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@ToString(exclude = {"restaurant", "freshMeal"})
@Entity
@Table(name = "returned_meals")
public class ReturnedMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "returned_meal_id")
    private Integer returnedMealId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fresh_meal_id")
    private FreshMeal freshMeal;

    @Column(name = "meal_name", nullable = false, length = 150)
    private String mealName;

    @Column(name = "reason", length = 100)
    private String reason;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "discount", nullable = false, precision = 5, scale = 2)
    private BigDecimal discount;

    @Column(name = "final_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "available";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}