package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.models.Location;
import com.zepto.zepto_backend.repositries.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    @Autowired
    LocationRepository locationRepository;

    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }

    public Location getLocationByUser(com.zepto.zepto_backend.models.User user) {
        return locationRepository.findByUserAndIsPrimaryTrue(user);
    }

    public void updateLocation(Location location) {
        locationRepository.save(location);
    }
}
