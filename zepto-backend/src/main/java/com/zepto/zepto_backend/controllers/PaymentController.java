package com.zepto.zepto_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payment")
@CrossOrigin("*")
public class PaymentController {

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@RequestBody Map<String, Object> payload) {
        // Mock payment initiation
        // In a real scenario, this would contact Stripe/Razorpay/etc.

        String paymentMethod = (String) payload.get("paymentMethod");
        Double amount = Double.valueOf(payload.get("amount").toString());

        Map<String, String> response = new HashMap<>();
        response.put("status", "INITIATED");
        response.put("transactionId", UUID.randomUUID().toString());
        response.put("message", "Payment initiated for amount: " + amount + " via " + paymentMethod);

        // Simplify for mock: just return success immediately for now
        return ResponseEntity.ok(response);
    }
}
