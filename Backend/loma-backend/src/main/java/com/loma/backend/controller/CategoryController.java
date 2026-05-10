package com.loma.backend.controller;

import com.loma.backend.entity.Category;
import com.loma.backend.repository.CategoryRepository;
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
