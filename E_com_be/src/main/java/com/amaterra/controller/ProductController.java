package com.amaterra.controller;

import com.amaterra.entity.Product;
import com.amaterra.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    // Create Product (JSON only)
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // Create Product with Images
    @PostMapping("/with-image")
    public ResponseEntity<?> createProductWithImage(
            @RequestParam("file") MultipartFile file1,
            @RequestParam(value = "file2", required = false) MultipartFile file2, 
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("price") String price,
            @RequestParam("stockQuantity") String stockQuantity,
            @RequestParam(value = "brand", required = false, defaultValue = "") String brand
    ) {
        try {    
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is required"));
            }
            if (price == null || price.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Price is required"));
            }
            if (stockQuantity == null || stockQuantity.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Stock quantity is required"));
            }
            if (file1 == null || file1.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "At least the first product image is required"));
            }

            Product savedProduct = productService.saveProductWithImages(
                file1, file2, name, description, category, price, stockQuantity, brand
            );
            return ResponseEntity.ok(savedProduct);
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    // Update Product with Images
    @PutMapping("/{id}/with-image")
    public ResponseEntity<?> updateProductWithImage(
            @PathVariable Integer id,
            @RequestParam(value = "file", required = false) MultipartFile file1,
            @RequestParam(value = "file2", required = false) MultipartFile file2,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("price") String price,
            @RequestParam("stockQuantity") String stockQuantity,
            @RequestParam(value = "brand", required = false, defaultValue = "") String brand,
            @RequestParam(value = "productAvailable", required = false, defaultValue = "true") Boolean productAvailable
    ) {
        try {
            Product updatedProduct = productService.updateProductWithImages(
                id, file1, file2, name, description, category, price, stockQuantity, brand, productAvailable
            );
            
            if (updatedProduct != null) {
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

