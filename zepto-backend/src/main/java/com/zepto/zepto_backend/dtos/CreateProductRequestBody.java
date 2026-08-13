package com.zepto.zepto_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequestBody {
    private String productName;
    private String manufacturerName;
    private int quantity;
    private double basePrice;
    private String productImageLink;
    private List<String> productImageLinks;
    private String productVideoLink;
    private double discountPrice;
    private List<String> aboutThisItem;
    private java.util.Map<String, String> technicalDetails;
}
