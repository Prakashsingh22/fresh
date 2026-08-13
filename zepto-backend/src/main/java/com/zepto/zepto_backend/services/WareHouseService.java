package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.CreateWareHouseRequestBody;
import com.zepto.zepto_backend.dtos.WareHouseItemRequestBody;
import com.zepto.zepto_backend.exceptions.InsufficientProductQuantityException;
import com.zepto.zepto_backend.exceptions.RecordDoesNotExist;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.*;
import com.zepto.zepto_backend.repositries.UserRepository;
import com.zepto.zepto_backend.repositries.WareHouseItemRepository;
import com.zepto.zepto_backend.repositries.WareHouseRepository;
import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
public class WareHouseService {
    @Autowired
    MappingUtility mappingUtility;
    @Autowired
    LocationService locationService;
    @Autowired
    WareHouseRepository wareHouseRepository;
    @Autowired
    ProductService productService;
    @Autowired
    WareHouseItemRepository wareHouseItemRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    public void createWareHouse(CreateWareHouseRequestBody createWareHouseRequestBody, User user) {
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!userService.isInternalUser(user)) {
            throw new UnAuthorizedException(String.format("User with id %s is not allowed to perform create-warehouse",
                    user.getId().toString()));
        }
        Location location = mappingUtility.mapWareHouseRBToLocation(createWareHouseRequestBody);
        location = locationService.saveLocation(location);
        WareHouse wareHouse = mappingUtility.mapWareHouseRBToWareHouse(createWareHouseRequestBody);
        wareHouse.setLocation(location);
        this.saveOrUpdateWareHouse(wareHouse);
    }

    @Transactional
    public void assignProductToWareHouse(WareHouseItemRequestBody wareHouseItemRequestBody, User user) {
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!userService.isInternalUser(user)) {
            throw new UnAuthorizedException(
                    String.format("User with id %s is not allowed to perform assign-product", user.getId().toString()));
        }
        UUID wid = wareHouseItemRequestBody.getWid();
        UUID pid = wareHouseItemRequestBody.getPid();
        Product product = productService.getProductById(pid);
        WareHouse wareHouse = this.getWareHouseById(wid);
        if (product == null || wareHouse == null) {
            throw new RecordDoesNotExist(String.format("Either product or wareHouse id doses not exist in system"));
        }
        Long assignedQty = wareHouseItemRepository.sumTotalQuantityByPid(pid);
        int currentAssigned = assignedQty != null ? assignedQty.intValue() : 0;
        int unassignedStock = product.getQuantity() - currentAssigned;

        if (unassignedStock < wareHouseItemRequestBody.getTotalQuantity()) {
            throw new InsufficientProductQuantityException(
                    String.format(
                            "Insufficient unassigned stock. Total: %d, Already Assigned: %d, Available: %d, Requested: %d",
                            product.getQuantity(), currentAssigned, unassignedStock,
                            wareHouseItemRequestBody.getTotalQuantity()));
        }

        // NOTE: Assignment only moves stock to warehouse, it does not reduce total
        // system stock.
        WareHouseItem wareHouseItem = mappingUtility.mapWareHouseRBToWareHouseItem(wareHouseItemRequestBody);
        wareHouseItem = this.saveOrUpdateWareHouseItem(wareHouseItem);
        wareHouse.getWareHouseItems().add(wareHouseItem);
        this.saveOrUpdateWareHouse(wareHouse);

    }

    // today

    // public void assignProductToWareHouse(
    // WareHouseItemRequestBody wareHouseItemRequestBody,
    // UUID userId
    // ) {
    // User user = userService.getUserById(userId);
    // if (user == null) {
    // throw new UserNotFoundException("User not found");
    // }
    //
    // if (!userService.isAppAdmin(user) && !userService.isMeintUser(user)) {
    // throw new UnAuthorizedException("Not authorized");
    // }
    //
    // Product product = productService.getProductById(
    // wareHouseItemRequestBody.getPid()
    // );
    //
    // WareHouse wareHouse = getWareHouseById(
    // wareHouseItemRequestBody.getWid()
    // );
    //
    // if (product == null || wareHouse == null) {
    // throw new RecordDoesNotExist("Product or Warehouse not found");
    // }
    //
    // if (product.getQuantity() < wareHouseItemRequestBody.getTotalQuantity()) {
    // throw new InsufficientProductQuantityException(
    // "Insufficient product quantity"
    // );
    // }
    //
    // // Reduce global stock
    // product.setQuantity(
    // product.getQuantity() - wareHouseItemRequestBody.getTotalQuantity()
    // );
    // productService.saveOrUpdateProduct(product);
    //
    // // Create warehouse item
    // WareHouseItem wareHouseItem =
    // mappingUtility.mapWareHouseRBToWareHouseItem(wareHouseItemRequestBody);
    //
    // saveOrUpdateWareHouseItem(wareHouseItem);
    // }

    public WareHouseItem saveOrUpdateWareHouseItem(WareHouseItem wareHouseItem) {
        return wareHouseItemRepository.save(wareHouseItem);
    }

    public WareHouse getWareHouseById(UUID id) {
        return wareHouseRepository.findById(id).orElse(null);
    }

    public WareHouse saveOrUpdateWareHouse(WareHouse wareHouse) {
        return this.wareHouseRepository.save(wareHouse);
    }

    public List<WareHouse> getAllWarehouses(UUID userId)
            throws UserNotFoundException, UnAuthorizedException {

        // Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // ALLOW INTERNAL USERS
        if (!userService.isInternalUser(user)) {
            throw new UnAuthorizedException("You are not authorized");
        }

        return wareHouseRepository.findAll();
    }

    public List<Product> getProductsByWarehouse(UUID wid, UUID userId)
            throws UserNotFoundException, UnAuthorizedException {

        // Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!userService.isInternalUser(user)) {
            throw new UnAuthorizedException("You are not authorized");
        }

        WareHouse warehouse = wareHouseRepository.findById(wid)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Extract products from warehouse items
        return warehouse.getWareHouseItems().stream()
                .map(item -> productService.getProductById(item.getPid()))
                .filter(p -> p != null)
                .toList();
    }

    // today

    // public List<Product> getProductsByWarehouse(UUID wid, UUID userId)
    // throws UserNotFoundException, UnAuthorizedException {
    //
    // User user = userRepository.findById(userId)
    // .orElseThrow(() -> new UserNotFoundException("User not found"));
    //
    // if (!user.getUserType().equals("ADMIN")
    // && !user.getUserType().equals("MEINT")) {
    // throw new UnAuthorizedException("You are not authorized");
    // }
    //
    // WareHouse warehouse = wareHouseRepository.findById(wid)
    // .orElseThrow(() -> new RuntimeException("Warehouse not found"));
    //
    // return wareHouseItemRepository
    // .findByWareHouse(warehouse)
    // .stream()
    // .map(WareHouseItem::getProduct)
    // .toList();
    // }

}
