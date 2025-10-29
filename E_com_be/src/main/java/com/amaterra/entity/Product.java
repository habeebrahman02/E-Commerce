package com.amaterra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String brand;
    private String name;
    private String description;
    private String category; 
    private String price;
    private String stockQuantity;
    
    @Column(name = "product_available")
    private Boolean productAvailable;
    
    @Column(name = "release_date")
    private LocalDate releaseDate;
    
    private String imageName;
    private String imageType;
    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;
    
    private String imageName2;
    private String imageType2;
    @Lob
    @Column(name = "image_data2", columnDefinition = "LONGBLOB")
    private byte[] imageData2;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getBrand() {
        return brand;
    }
    public void setBrand(String brand) {
        this.brand = brand;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getPrice() {
        return price;
    }
    public void setPrice(String price) {
        this.price = price;
    }
    public String getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(String stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public Boolean getProductAvailable() {
        return productAvailable;
    }
    public void setProductAvailable(Boolean productAvailable) {
        this.productAvailable = productAvailable;
    }
    public LocalDate getReleaseDate() {
        return releaseDate;
    }
    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }
    
    // First Image getters/setters
    public String getImageName() {
        return imageName;
    }
    public void setImageName(String imageName) {
        this.imageName = imageName;
    }
    public String getImageType() {
        return imageType;
    }
    public void setImageType(String imageType) {
        this.imageType = imageType;
    }
    public byte[] getImageData() {
        return imageData;
    }
    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
    
    // Second Image getters/setters
    public String getImageName2() {
        return imageName2;
    }
    public void setImageName2(String imageName2) {
        this.imageName2 = imageName2;
    }
    public String getImageType2() {
        return imageType2;
    }
    public void setImageType2(String imageType2) {
        this.imageType2 = imageType2;
    }
    public byte[] getImageData2() {
        return imageData2;
    }
    public void setImageData2(byte[] imageData2) {
        this.imageData2 = imageData2;
    }
}

