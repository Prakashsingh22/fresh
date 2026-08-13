package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.CreateProductRequestBody;
import com.zepto.zepto_backend.exceptions.RecordDoesNotExist;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.Product;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.models.WareHouseItem;
import com.zepto.zepto_backend.services.ProductService;
import com.zepto.zepto_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/product")
public class ProductController {
    @Autowired
    ProductService productService;

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProduct(@RequestBody CreateProductRequestBody createProductRequestBody,
            Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            productService.registerProduct(createProductRequestBody, user);
            return new ResponseEntity<>("Product created successfully ", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Product>> getProductsForUser(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(
                productService.getProductsByUserId(user.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductByName(@RequestParam String productName, Principal principal) {
        try {
            User user = null;
            if (principal != null) {
                user = userService.getUserByEmail(principal.getName());
            }

            List<Product> productList;
            if (userService.isInternalUser(user)) {
                // Admins search global items
                productList = productService.searchProductByName(productName);
            } else {
                // Guests and Consumers ONLY see items assigned to warehouses
                productList = productService.searchAssignedProductsByName(productName);
            }
            return ResponseEntity.ok(productList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (RecordDoesNotExist e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts(Principal principal) {
        User user = null;
        if (principal != null) {
            user = userService.getUserByEmail(principal.getName());
        }

        if (userService.isInternalUser(user)) {
            // Admins see all products (including unassigned)
            return ResponseEntity.ok(productService.getAllProducts());
        }
        // Guests and Consumers ONLY see products assigned to warehouses
        return ResponseEntity.ok(productService.getAssignedProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        Product product = productService.getProductWithCalculatedQuantity(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(product);
    }
}
