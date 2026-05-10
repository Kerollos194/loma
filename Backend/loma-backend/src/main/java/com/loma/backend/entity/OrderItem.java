package com.loma.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.math.BigDecimal;

@Data
@ToString(exclude = "order")
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "meal_type", nullable = false, length = 10)
    private String mealType;

    @Column(name = "meal_id", nullable = false)
    private Integer mealId;

    @Column(name = "meal_name", nullable = false, length = 150)
    private String mealName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
