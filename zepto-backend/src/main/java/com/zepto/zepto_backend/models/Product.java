package com.zepto.zepto_backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    @Column(nullable = false)
    private String productName;
    @Column(nullable = false)
    private String manufacturerName;
    private int quantity;
    private double basePrice;
    private String productImageLink;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_link")
    private List<String> productImageLinks;
    private String productVideoLink;
    private double discountPrice;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    @CollectionTable(name = "product_about_items", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "detail", length = 1000)
    private List<String> aboutThisItem;

    @ElementCollection
    @CollectionTable(name = "product_technical_details", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "spec_key")
    @Column(name = "spec_value")
    private java.util.Map<String, String> technicalDetails;

}
