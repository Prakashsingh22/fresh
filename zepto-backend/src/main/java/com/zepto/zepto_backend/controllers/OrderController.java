package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.CreateOrderRequestDTO;
import com.zepto.zepto_backend.enums.OrderStatus;
import com.zepto.zepto_backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class OrderController {
    @Autowired
    OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(
            @RequestBody CreateOrderRequestDTO request,
            Principal principal) {
        UUID orderId = orderService.placeOrder(request, principal);
        return ResponseEntity.ok(Map.of(
                "message", "Order placed successfully",
                "orderId", orderId));
    }

    @GetMapping("/orders/my")
    public ResponseEntity<?> myOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> orderDetails(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(orderId));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id,
            @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok("Order status updated");
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Principal principal) {
        String reason = payload.get("reason");
        orderService.cancelOrder(id, reason, principal);
        return ResponseEntity.ok("Order cancelled successfully");
    }

    @PostMapping("/orders/{id}/return")
    public ResponseEntity<?> returnOrder(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Principal principal) {
        String reason = payload.get("reason");
        String comments = payload.get("comments");
        orderService.returnOrder(id, reason, comments, principal);
        return ResponseEntity.ok("Return request submitted successfully");
    }

    @GetMapping("/orders/all")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

}
