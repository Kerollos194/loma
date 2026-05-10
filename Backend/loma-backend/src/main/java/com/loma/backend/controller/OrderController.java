package com.loma.backend.controller;

import com.loma.backend.entity.Order;
import com.loma.backend.service.OrderService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(order));
    }

    @GetMapping("/user/{userId}")
    public List<Order> getByUserId(@PathVariable Integer userId) {
        return orderService.findByUserId(userId);
    }
}
