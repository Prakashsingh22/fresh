package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.CreateProductRequestBody;
import com.zepto.zepto_backend.exceptions.RecordDoesNotExist;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.*;
import com.zepto.zepto_backend.repositries.LocationRepository;
import com.zepto.zepto_backend.repositries.ProductRepository;
import com.zepto.zepto_backend.repositries.WareHouseItemRepository;
import com.zepto.zepto_backend.repositries.WareHouseRepository;
import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    UserService userService;

    @Autowired
    MappingUtility mappingUtility;
    @Autowired
    ProductRepository productRepository;
    // today

    @Autowired
    WareHouseItemRepository wareHouseItemRepository;

    // today end

    public void registerProduct(CreateProductRequestBody createProductRequestBody, User user) {
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!userService.isAdmin(user)) {
            throw new UnAuthorizedException(String.format("User with id %s is not allowed to perform register-product",
                    user.getId().toString()));
        }
        Product product = mappingUtility.mapRegisterProductRBToProduct(createProductRequestBody);
        this.saveOrUpdateProduct(product);
    }

    public Product getProductById(UUID id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product getProductWithCalculatedQuantity(UUID id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setQuantity(Math.max(0, product.getQuantity()));
        }
        return product;
    }

    public Product saveOrUpdateProduct(Product product) {
        return this.productRepository.save(product);
    }

    public List<Product> getProductsByUserId(UUID userId) {

        User user = userService.getUserById(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        return productRepository.findByUser_Id(userId); // may return []
    }

    public List<Product> searchProductByName(String productName) {
        if (productName == null || productName.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        // Use global query to show all products (for admins)
        List<Product> productList = productRepository.findByProductNameStartingWithIgnoreCase(productName);

        // Clamp quantities for display
        productList.forEach(p -> p.setQuantity(Math.max(0, p.getQuantity())));

        // return empty list instead of exception
        return productList.isEmpty() ? Collections.emptyList() : productList;
    }

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(p -> p.setQuantity(Math.max(0, p.getQuantity())));
        return products;
    }

    public List<Product> getAssignedProducts() {
        List<Product> products = productRepository.findAssignedProducts();
        products.forEach(p -> p.setQuantity(Math.max(0, p.getQuantity())));
        return products;
    }

    public List<Product> searchAssignedProductsByName(String productName) {
        if (productName == null || productName.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<Product> products = productRepository.searchAssignedProductsStartingWith(productName);
        products.forEach(p -> p.setQuantity(Math.max(0, p.getQuantity())));
        return products;
    }

    // today

    // public List<WareHouseItem> searchProductByName(UUID userId, String
    // productName) {
    //
    // // 1️⃣ Get user
    // User user = userService.getUserById(userId);
    // if (user == null) {
    // throw new UserNotFoundException("User not found");
    // }
    //
    // // 2️⃣ Get user's primary location
    // Location location =
    // locationRepository.findByUserIdAndIsPrimaryTrue(userId);
    //
    // if (location == null) {
    // throw new RecordDoesNotExist("Primary location not found for user");
    // }
    //
    // // 3️⃣ Allowed pincodes logic
    // List<String> allowedPincodes = getAllowedPincodes(location.getPinCode());
    //
    // // 4️⃣ Find warehouses in allowed pincodes
    // List<WareHouse> warehouses =
    // wareHouseRepository.findByNearbyPincodes(allowedPincodes);
    //
    // if (warehouses.isEmpty()) {
    // throw new RecordDoesNotExist("No warehouses available near your location");
    // }
    //
    // // 5️⃣ Search product in those warehouses
    // List<WareHouseItem> items =
    // wareHouseItemRepository.searchAvailableProducts(productName, warehouses);
    //
    // if (items.isEmpty()) {
    // throw new RecordDoesNotExist("No product found near your location");
    // }
    //
    // return items;
    // }
    // private List<String> getAllowedPincodes(String pinCode) {
    // int pin = Integer.parseInt(pinCode);
    //
    // return List.of(
    // String.valueOf(pin),
    // String.valueOf(pin - 1),
    // String.valueOf(pin + 1),
    // String.valueOf(pin + 2)
    // );
    // }

}
