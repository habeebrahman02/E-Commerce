package com.amaterra.service;

import com.amaterra.entity.Product;
import com.amaterra.repository.ProductRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public Product saveProduct(Product product) {
        return productRepo.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getProductById(Integer id) {
        return productRepo.findById(id).orElse(null);
    }

    public boolean deleteProduct(Integer id) {
        if (productRepo.existsById(id)) {
            productRepo.deleteById(id);
            return true;
        }
        return false;
    }

    //  Save product with two images
    public Product saveProductWithImages(
            MultipartFile file1, 
            MultipartFile file2, 
            String name, 
            String description, 
            String category, 
            String price, 
            String stockQuantity,
            String brand
    ) throws IOException {
        
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setBrand(brand != null ? brand : "");
        product.setProductAvailable(true);
        product.setReleaseDate(LocalDate.now());

        // Handle first image (required)
        if (file1 != null && !file1.isEmpty()) {
            product.setImageName(file1.getOriginalFilename());
            product.setImageType(file1.getContentType());
            product.setImageData(file1.getBytes());
        }

        // Handle second image (optional)
        if (file2 != null && !file2.isEmpty()) {
            product.setImageName2(file2.getOriginalFilename());
            product.setImageType2(file2.getContentType());
            product.setImageData2(file2.getBytes());
        }

        return productRepo.save(product);
    }

    // Update product with images
    public Product updateProductWithImages(
            Integer id,
            MultipartFile file1,
            MultipartFile file2,
            String name,
            String description,
            String category,
            String price,
            String stockQuantity,
            String brand,
            Boolean productAvailable
    ) throws IOException {
        
        return productRepo.findById(id).map(product -> {
            product.setName(name);
            product.setDescription(description);
            product.setCategory(category);
            product.setPrice(price);
            product.setStockQuantity(stockQuantity);
            product.setBrand(brand != null ? brand : "");
            product.setProductAvailable(productAvailable != null ? productAvailable : true);

            try {
                
                if (file1 != null && !file1.isEmpty()) {
                    product.setImageName(file1.getOriginalFilename());
                    product.setImageType(file1.getContentType());
                    product.setImageData(file1.getBytes());
                }

                
                if (file2 != null && !file2.isEmpty()) {
                    product.setImageName2(file2.getOriginalFilename());
                    product.setImageType2(file2.getContentType());
                    product.setImageData2(file2.getBytes());
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image files", e);
            }

            return productRepo.save(product);
        }).orElse(null);
    }

    public Product saveProductWithImage(MultipartFile file, String name, String description, String category, String price, String stockQuantity) throws IOException {
        return saveProductWithImages(file, null, name, description, category, price, stockQuantity, "");
    }

    // Update product without image 
    public Product updateProduct(Integer id, Product productDetails) {
        return productRepo.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setCategory(productDetails.getCategory());
            product.setPrice(productDetails.getPrice());
            product.setStockQuantity(productDetails.getStockQuantity());
            
            if (productDetails.getProductAvailable() != null) {
                product.setProductAvailable(productDetails.getProductAvailable());
            }
            if (productDetails.getBrand() != null) {
                product.setBrand(productDetails.getBrand());
            }
            if (productDetails.getReleaseDate() != null) {
                product.setReleaseDate(productDetails.getReleaseDate());
            }
            
            return productRepo.save(product);
        }).orElse(null);
    }
}

