package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.ConsumerRequestBody;
import com.zepto.zepto_backend.models.Location;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {
    @Autowired
    UserService userService;
    @Autowired
    MappingUtility mappingUtility;
    @Autowired
    LocationService locationService;

    public void createConsumer(ConsumerRequestBody consumerRequestBody) {
        User consumer = mappingUtility.mapConsumerRBToUser(consumerRequestBody);
        consumer = userService.saveUser(consumer);
        Location location = mappingUtility.mapConsumerRBToLocation(consumerRequestBody, consumer);
        locationService.saveLocation(location);
    }
}