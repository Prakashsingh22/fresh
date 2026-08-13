package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.ConsumerRequestBody;
import com.zepto.zepto_backend.services.ConsumerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/consumer")
public class ConsumerController {

    @Autowired
    ConsumerService consumerService;

    @RequestMapping("/create-account")
    public String registerConsumer(@RequestBody ConsumerRequestBody consumerRequestBody) {
        consumerService.createConsumer(consumerRequestBody);
        return "consumer created successfully";

    }
}
