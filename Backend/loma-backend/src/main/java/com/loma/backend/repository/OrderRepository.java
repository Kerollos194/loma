package com.loma.backend.repository;

import com.loma.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserUserId(Integer userId);
    List<Order> findByStatus(String status);
}
