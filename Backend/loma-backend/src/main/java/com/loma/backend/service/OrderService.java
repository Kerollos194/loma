package com.loma.backend.service;

import com.loma.backend.entity.Order;
import com.loma.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepo;

    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Order placeOrder(Order order) {
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        return orderRepo.save(order);
    }

    public List<Order> findByUserId(Integer userId) {
        return orderRepo.findByUserUserId(userId);
    }

    public Optional<Order> findById(Integer id) {
        return orderRepo.findById(id);
    }
}
