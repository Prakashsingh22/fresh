package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.CreateWareHouseRequestBody;
import com.zepto.zepto_backend.dtos.WareHouseItemRequestBody;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.Product;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.services.UserService;
import com.zepto.zepto_backend.services.WareHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/warehouse")
public class WareHouseController {
    @Autowired
    WareHouseService wareHouseService;

    @Autowired
    UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> createWareHouse(@RequestBody CreateWareHouseRequestBody createWareHouseRequestBody,
            Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            wareHouseService.createWareHouse(createWareHouseRequestBody, user);
            return new ResponseEntity<>("WareHouse created  successfully ", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/product/assign")
    public ResponseEntity<?> assignProductToWareHouse(@RequestBody WareHouseItemRequestBody wareHouseItemRequestBody,
            Principal principal) {

        try {
            User user = userService.getUserByEmail(principal.getName());
            wareHouseService.assignProductToWareHouse(wareHouseItemRequestBody, user);
            return new ResponseEntity<>("Product assigned successfully ", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllWarehouses(Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return new ResponseEntity<>(
                    wareHouseService.getAllWarehouses(user.getId()),
                    HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{wid}/products")
    public ResponseEntity<List<Product>> getProductsByWarehouse(
            @PathVariable UUID wid,
            Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            List<Product> products = wareHouseService.getProductsByWarehouse(wid, user.getId());
            return ResponseEntity.ok(products);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
