package com.loma.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@ToString(exclude = {"restaurant", "category"})
@Entity
@Table(name = "fresh_meals")
public class FreshMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
    private Integer mealId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
