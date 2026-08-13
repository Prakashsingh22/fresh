package com.zepto.zepto_backend.utility;

import com.zepto.zepto_backend.dtos.*;
import com.zepto.zepto_backend.enums.OrderStatus;
import com.zepto.zepto_backend.enums.UserStatus;
import com.zepto.zepto_backend.enums.UserType;
import com.zepto.zepto_backend.models.*;
import com.zepto.zepto_backend.repositries.ProductRepository;
import com.zepto.zepto_backend.repositries.WareHouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MappingUtility {
    // today
    @Autowired
    WareHouseRepository wareHouseRepository;

    @Autowired
    ProductRepository productRepository;

    // today end
    public User mapConsumerRBToUser(ConsumerRequestBody consumerRequestBody) {
        User user = new User();
        user.setUserType(UserType.CONSUMER.name());
        user.setUserName(consumerRequestBody.getUserName());
        user.setEmail(consumerRequestBody.getEmail());
        user.setPassword(consumerRequestBody.getPassword());
        user.setPhoneNumber(consumerRequestBody.getPhoneNumber());
        user.setStatus(UserStatus.ACTIVE.toString());
        return user;
    }

    public Location mapConsumerRBToLocation(ConsumerRequestBody consumerRequestBody, User user) {
        Location location = new Location();
        location.setAddressLine1(consumerRequestBody.getAddressLine1());
        location.setAddressLine2(consumerRequestBody.getAddressLine2());
        location.setAddressLine3(consumerRequestBody.getAddressLine3());
        location.setCity(consumerRequestBody.getCity());
        location.setState(consumerRequestBody.getState());
        location.setCountry(consumerRequestBody.getCountry());
        location.setIsPrimary(consumerRequestBody.getIsPrimary());
        location.setPinCode(consumerRequestBody.getPinCode());
        location.setUser(user);
        return location;
    }

    public User mapInviteAdminToUser(InviteAdminRequestBody inviteAdminRequestBody, String userType) {
        User user = new User();
        user.setStatus(UserStatus.INACTIVE.toString());
        if (userType.equals(UserType.WAREHOUSE_ADMIN.toString())) {
            user.setUserType(UserType.WAREHOUSE_ADMIN.toString());
        } else {
            user.setUserType(UserType.ZEPTO_APP_ADMIN.toString());
        }
        user.setUserName(inviteAdminRequestBody.getUserName());
        user.setPassword("admin123");
        user.setPhoneNumber(inviteAdminRequestBody.getPhoneNumber());
        user.setEmail(inviteAdminRequestBody.getEmail());
        return user;

    }

    public WareHouse mapWareHouseRBToWareHouse(CreateWareHouseRequestBody createWareHouseRequestBody) {
        WareHouse wareHouse = new WareHouse();
        wareHouse.setWareHouseName(createWareHouseRequestBody.getWareHouseName());
        wareHouse.setContactNumber(createWareHouseRequestBody.getWareHouseContactNumber());
        wareHouse.setEmail(createWareHouseRequestBody.getWareHouseEmail());
        return wareHouse;
    }

    public Location mapWareHouseRBToLocation(CreateWareHouseRequestBody createWareHouseRequestBody) {
        Location location = new Location();
        location.setIsPrimary(true);
        location.setCity(createWareHouseRequestBody.getCity());
        location.setState(createWareHouseRequestBody.getState());
        location.setCountry(createWareHouseRequestBody.getCountry());
        location.setPinCode(createWareHouseRequestBody.getPinCode());
        location.setAddressLine1(createWareHouseRequestBody.getAddressLine1());
        location.setAddressLine2(createWareHouseRequestBody.getAddressLine2());
        location.setAddressLine3(createWareHouseRequestBody.getAddressLine3());
        return location;
    }

    public Product mapRegisterProductRBToProduct(CreateProductRequestBody createProductRequestBody) {
        Product product = new Product();
        product.setProductName(createProductRequestBody.getProductName());
        product.setQuantity(createProductRequestBody.getQuantity());
        product.setManufacturerName(createProductRequestBody.getManufacturerName());
        product.setBasePrice(createProductRequestBody.getBasePrice());
        product.setProductImageLinks(createProductRequestBody.getProductImageLinks());

        // Ensure the primary productImageLink is populated from the first available
        // link in productImageLinks
        String primaryLink = createProductRequestBody.getProductImageLink();
        List<String> links = createProductRequestBody.getProductImageLinks();

        if ((primaryLink == null || primaryLink.trim().isEmpty()) && links != null && !links.isEmpty()) {
            // Find the first non-empty link in the list
            for (String link : links) {
                if (link != null && !link.trim().isEmpty()) {
                    primaryLink = link;
                    break;
                }
            }
        }

        product.setProductImageLink(primaryLink);

        product.setProductVideoLink(createProductRequestBody.getProductVideoLink());
        product.setDiscountPrice(createProductRequestBody.getDiscountPrice());
        product.setAboutThisItem(createProductRequestBody.getAboutThisItem());
        product.setTechnicalDetails(createProductRequestBody.getTechnicalDetails());
        return product;
    }

    public WareHouseItem mapWareHouseRBToWareHouseItem(WareHouseItemRequestBody wareHouseItemRequestBody) {
        WareHouseItem wareHouseItem = new WareHouseItem();
        wareHouseItem.setWid(wareHouseItemRequestBody.getWid());
        wareHouseItem.setBasePrice(wareHouseItemRequestBody.getBasePrice());
        wareHouseItem.setDiscount(wareHouseItemRequestBody.getDiscount());
        wareHouseItem.setTotalQuantity(wareHouseItemRequestBody.getTotalQuantity());
        wareHouseItem.setPid(wareHouseItemRequestBody.getPid());
        return wareHouseItem;
    }

    public UserResponseDTO mapUserToUserResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO(user);
        dto.setId(user.getId());
        dto.setName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhoneNumber());
        dto.setUserType(user.getUserType());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setStatus(user.getStatus());
        return dto;
    }
    // ================== ORDER MAPPINGS ==================

    public Order mapCreateOrderRequestToOrder(
            CreateOrderRequestDTO request,
            User user,
            WareHouse wareHouse) {
        Order order = new Order();
        order.setStatus(OrderStatus.PLACED);
        order.setOrderPlacedTime(LocalDateTime.now());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(request.getShippingAddress());
        order.setConsumer(user);
        order.setWareHouse(wareHouse);
        return order;
    }

    public OrderItem mapOrderItemRequestToOrderItem(
            OrderItemsRequestDTO itemRequest,
            UUID orderId) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOid(orderId);
        orderItem.setPid(itemRequest.getPid());
        orderItem.setPrice(itemRequest.getPrice());
        orderItem.setQuantity(itemRequest.getQuantity());
        return orderItem;
    }

    public OrderResponseDTO mapOrderToOrderResponseDTO(Order order, List<OrderItem> items) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setOrder(order);

        List<OrderItemResponseDTO> itemDTOs = new java.util.ArrayList<>();
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getPid()).orElse(new Product());
            itemDTOs.add(new OrderItemResponseDTO(
                    item.getPid(),
                    product.getProductName() != null ? product.getProductName() : "Unknown Product",
                    product.getProductImageLink(),
                    item.getQuantity(),
                    item.getPrice()));
        }
        response.setItems(itemDTOs);
        return response;
    }

    // today
    // public WareHouseItem mapWareHouseRBToWareHouseItem(
    // WareHouseItemRequestBody wareHouseItemRequestBody
    // ) {
    // WareHouseItem wareHouseItem = new WareHouseItem();
    //
    // // Fetch Warehouse entity
    // WareHouse wareHouse = wareHouseRepository
    // .findById(wareHouseItemRequestBody.getWid())
    // .orElseThrow(() -> new RuntimeException("Warehouse not found"));
    //
    // // Fetch Product entity
    // Product product = productRepository
    // .findById(wareHouseItemRequestBody.getPid())
    // .orElseThrow(() -> new RuntimeException("Product not found"));
    //
    // wareHouseItem.setWareHouse(wareHouse);
    // wareHouseItem.setProduct(product);
    // wareHouseItem.setBasePrice(wareHouseItemRequestBody.getBasePrice());
    // wareHouseItem.setDiscount(wareHouseItemRequestBody.getDiscount());
    // wareHouseItem.setTotalQuantity(wareHouseItemRequestBody.getTotalQuantity());
    //
    // return wareHouseItem;
    // }

}
