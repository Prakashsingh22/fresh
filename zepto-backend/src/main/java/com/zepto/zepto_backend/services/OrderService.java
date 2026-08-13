package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.CreateOrderRequestDTO;
import com.zepto.zepto_backend.dtos.OrderItemsRequestDTO;
import com.zepto.zepto_backend.dtos.OrderResponseDTO;
import com.zepto.zepto_backend.enums.OrderStatus;
import com.zepto.zepto_backend.models.*;
import com.zepto.zepto_backend.repositries.*;
import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
        @Autowired
        UserService userService;
        @Autowired
        OrderRepository orderRepository;
        @Autowired
        OrderItemRepository orderItemRepository;
        @Autowired
        UserRepository userRepository;
        @Autowired
        WareHouseRepository wareHouseRepository;
        @Autowired
        WareHouseItemRepository wareHouseItemRepository;
        @Autowired
        MappingUtility mappingUtility;
        @Autowired
        ProductRepository productRepository;

        @Transactional
        public UUID placeOrder(CreateOrderRequestDTO request, Principal principal) {

                // 1️⃣ Fetch user
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // 2️⃣ Aggregate items (if duplicate PIDs are sent)
                java.util.Map<UUID, Integer> aggregatedQuantities = new java.util.HashMap<>();
                for (OrderItemsRequestDTO item : request.getItems()) {
                        aggregatedQuantities.put(item.getPid(),
                                        aggregatedQuantities.getOrDefault(item.getPid(), 0) + item.getQuantity());
                }

                // 3️⃣ Determine fulfillment per item
                java.util.Map<UUID, UUID> itemToWHId = new java.util.HashMap<>();
                List<WareHouse> allWHs = wareHouseRepository.findAll();

                // Try to find ONE warehouse first (legacy/preferred)
                WareHouse singleWH = null;
                for (WareHouse wh : allWHs) {
                        boolean canFulfillAll = true;
                        for (var entry : aggregatedQuantities.entrySet()) {
                                var stock = wareHouseItemRepository.findByWidAndPid(wh.getId(), entry.getKey());
                                if (stock.isEmpty() || stock.get().getTotalQuantity() < entry.getValue()) {
                                        canFulfillAll = false;
                                        break;
                                }
                        }
                        if (canFulfillAll) {
                                singleWH = wh;
                                for (var entry : aggregatedQuantities.entrySet()) {
                                        itemToWHId.put(entry.getKey(), wh.getId());
                                }
                                break;
                        }
                }

                // If no single warehouse, find per-item fulfillment
                if (singleWH == null) {
                        for (var entry : aggregatedQuantities.entrySet()) {
                                boolean itemFulfillerFound = false;
                                for (WareHouse wh : allWHs) {
                                        var stock = wareHouseItemRepository.findByWidAndPid(wh.getId(), entry.getKey());
                                        if (stock.isPresent() && stock.get().getTotalQuantity() >= entry.getValue()) {
                                                itemToWHId.put(entry.getKey(), wh.getId());
                                                itemFulfillerFound = true;
                                                break;
                                        }
                                }
                                if (!itemFulfillerFound) {
                                        // Still can't find stock for this item specifically, throw diagnostic error
                                        StringBuilder errorMsg = new StringBuilder(
                                                        "No warehouse has sufficient stock. \n");
                                        for (WareHouse wh : allWHs) {
                                                errorMsg.append("Warehouse '").append(wh.getWareHouseName())
                                                                .append("': ");
                                                var stock = wareHouseItemRepository.findByWidAndPid(wh.getId(),
                                                                entry.getKey());
                                                int available = stock.isPresent() ? stock.get().getTotalQuantity() : 0;
                                                Product p = productRepository.findById(entry.getKey()).orElse(null);
                                                String name = p != null ? p.getProductName()
                                                                : entry.getKey().toString();
                                                errorMsg.append(name).append(" (Available: ").append(available)
                                                                .append(", Needed: ").append(entry.getValue())
                                                                .append(")\n");
                                        }
                                        throw new RuntimeException(errorMsg.toString());
                                }
                        }
                }

                // 4️⃣ Create & save order
                // Use singleWH if found, otherwise first item's warehouse as "primary"
                WareHouse primaryWH = singleWH != null ? singleWH
                                : wareHouseRepository.findById(itemToWHId.values().stream().findFirst().get())
                                                .orElse(null);

                Order order = mappingUtility.mapCreateOrderRequestToOrder(
                                request, user, primaryWH);
                order.setStatus(OrderStatus.PLACED);
                order.setOrderPlacedTime(LocalDateTime.now());

                // Calculate total amount
                double totalAmount = 0.0;
                for (OrderItemsRequestDTO item : request.getItems()) {
                        Product product = productRepository.findById(item.getPid()).orElse(null);
                        if (product != null) {
                                // Use discountPrice if available, otherwise basePrice
                                double price = product.getDiscountPrice() > 0 ? product.getDiscountPrice()
                                                : product.getBasePrice();
                                totalAmount += price * item.getQuantity();
                        }
                }
                order.setTotalAmount(totalAmount);

                Order savedOrder = orderRepository.save(order);

                // 5️⃣ Process order items + reduce stock
                for (OrderItemsRequestDTO item : request.getItems()) {
                        UUID selectedWHId = itemToWHId.get(item.getPid());

                        Product product = productRepository.findById(item.getPid())
                                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getPid()));

                        // ✅ Reduce Warehouse Item Quantity
                        WareHouseItem whItem = wareHouseItemRepository
                                        .findByWidAndPid(selectedWHId, product.getId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Product not available in selected warehouse"));

                        whItem.setTotalQuantity(whItem.getTotalQuantity() - item.getQuantity());
                        wareHouseItemRepository.save(whItem);

                        // ✅ Reduce Global Product Quantity
                        if (product.getQuantity() < item.getQuantity()) {
                                throw new RuntimeException("CRITICAL: Total system stock for "
                                                + product.getProductName() +
                                                " is insufficient (Total: " + product.getQuantity() +
                                                ", Needed: " + item.getQuantity() + "). Please contact admin.");
                        }
                        product.setQuantity(Math.max(0, product.getQuantity() - item.getQuantity()));
                        productRepository.save(product);

                        // ✅ Save order item with recorded warehouse ID
                        OrderItem orderItem = mappingUtility.mapOrderItemRequestToOrderItem(
                                        item,
                                        savedOrder.getId());
                        orderItem.setWid(selectedWHId);

                        orderItemRepository.save(orderItem);
                }

                // 6️⃣ Return order ID
                return savedOrder.getId();

        }

        public List<Order> getMyOrders(Principal principal) {

                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return orderRepository.findByConsumer_Id(user.getId());
        }

        public OrderResponseDTO getOrderDetails(UUID orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));
                List<OrderItem> items = orderItemRepository.findByOid(orderId);
                return mappingUtility.mapOrderToOrderResponseDTO(order, items);
        }

        @Transactional
        public void updateOrderStatus(UUID orderId, OrderStatus status) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                OrderStatus oldStatus = order.getStatus();
                order.setStatus(status);

                if (status == OrderStatus.DISPATCHED) {
                        order.setOrderDispatchedTime(LocalDateTime.now());
                }

                // ✅ If transitioning TO Cancelled or Returned from a non-recovered state,
                // restore stock
                if ((status == OrderStatus.CANCELLED || status == OrderStatus.RETURNED) &&
                                (oldStatus != OrderStatus.CANCELLED && oldStatus != OrderStatus.RETURNED)) {
                        restoreStock(orderId);
                }

                orderRepository.save(order);
        }

        @Transactional
        public void cancelOrder(UUID orderId, String reason, Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getConsumer().getId().equals(user.getId())) {
                        throw new RuntimeException("You are not authorized to cancel this order");
                }

                if (order.getStatus() == OrderStatus.DISPATCHED || order.getStatus() == OrderStatus.DELIVERED
                                || order.getStatus() == OrderStatus.CANCELLED) {
                        throw new RuntimeException("Order cannot be cancelled at this stage");
                }

                order.setStatus(OrderStatus.CANCELLED);
                order.setCancellationReason(reason);
                orderRepository.save(order);

                restoreStock(orderId);
        }

        @Transactional
        public void returnOrder(UUID orderId, String reason, String comments, Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                if (!order.getConsumer().getId().equals(user.getId())) {
                        throw new RuntimeException("You are not authorized to return this order");
                }

                if (order.getStatus() != OrderStatus.DELIVERED) {
                        throw new RuntimeException("Only delivered orders can be returned");
                }

                order.setStatus(OrderStatus.RETURNED);
                order.setReturnReason(reason);
                order.setReturnComments(comments);
                order.setReturnRequestedTime(LocalDateTime.now());
                orderRepository.save(order);

                restoreStock(orderId);
        }

        /**
         * ✅ Restores stock to both Global Inventory and Warehouse Inventory
         */
        private void restoreStock(UUID orderId) {
                List<OrderItem> orderItems = orderItemRepository.findByOid(orderId);

                for (OrderItem item : orderItems) {
                        // 1. Restore Global Product Quantity
                        Product product = productRepository.findById(item.getPid()).orElse(null);
                        if (product != null) {
                                product.setQuantity(product.getQuantity() + item.getQuantity());
                                productRepository.save(product);
                        }

                        // 2. Restore Warehouse Item Quantity
                        if (item.getWid() != null) {
                                WareHouseItem whItem = wareHouseItemRepository
                                                .findByWidAndPid(item.getWid(), item.getPid())
                                                .orElse(null);

                                if (whItem != null) {
                                        whItem.setTotalQuantity(whItem.getTotalQuantity() + item.getQuantity());
                                        wareHouseItemRepository.save(whItem);
                                }
                        }
                }
        }

        @Transactional
        public void markOrderPacked(UUID orderId, User warehouseAdmin) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // 🔐 Ensure the admin's warehouse is involved in this order
                WareHouse adminWH = wareHouseRepository.findByWareHouseAdmin_Id(warehouseAdmin.getId())
                                .orElseThrow(() -> new RuntimeException("Admin warehouse not found"));

                List<OrderItem> items = orderItemRepository.findByOid(orderId);
                boolean isAssociated = items.stream().anyMatch(i -> adminWH.getId().equals(i.getWid()));

                if (!isAssociated) {
                        throw new RuntimeException("Unauthorized warehouse access for this order");
                }

                if (order.getStatus() != OrderStatus.PLACED) {
                        throw new RuntimeException("Only PLACED orders can be PACKED");
                }

                order.setStatus(OrderStatus.PACKED);
                orderRepository.save(order);
        }

        @Transactional
        public void markOrderDispatched(UUID orderId, User warehouseAdmin) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                WareHouse adminWH = wareHouseRepository.findByWareHouseAdmin_Id(warehouseAdmin.getId())
                                .orElseThrow(() -> new RuntimeException("Admin warehouse not found"));

                List<OrderItem> items = orderItemRepository.findByOid(orderId);
                boolean isAssociated = items.stream().anyMatch(i -> adminWH.getId().equals(i.getWid()));

                if (!isAssociated) {
                        throw new RuntimeException("Unauthorized warehouse access for this order");
                }

                if (order.getStatus() != OrderStatus.PACKED) {
                        throw new RuntimeException("Order must be PACKED first");
                }

                order.setStatus(OrderStatus.DISPATCHED);
                order.setOrderDispatchedTime(LocalDateTime.now());

                orderRepository.save(order);
        }

        public List<Order> getWarehouseOrders(Principal principal) {

                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (!userService.isWarehouseAdmin(user)) {
                        throw new RuntimeException("Unauthorized");
                }

                WareHouse wh = wareHouseRepository
                                .findByWareHouseAdmin_Id(user.getId())
                                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

                return orderRepository.findByWareHouse_Id(wh.getId());
        }

        public List<Order> getAllOrders() {
                List<Order> orders = orderRepository.findAll();

                // Calculate totalAmount for orders that don't have it
                for (Order order : orders) {
                        if (order.getTotalAmount() == null || order.getTotalAmount() == 0) {
                                List<OrderItem> items = orderItemRepository.findByOid(order.getId());
                                double total = 0.0;
                                for (OrderItem item : items) {
                                        Product product = productRepository.findById(item.getPid()).orElse(null);
                                        if (product != null) {
                                                double price = product.getDiscountPrice() > 0
                                                                ? product.getDiscountPrice()
                                                                : product.getBasePrice();
                                                total += price * item.getQuantity();
                                        }
                                }
                                order.setTotalAmount(total);
                                // Optionally save to database to persist the calculation
                                orderRepository.save(order);
                        }
                }

                return orders;
        }

}
