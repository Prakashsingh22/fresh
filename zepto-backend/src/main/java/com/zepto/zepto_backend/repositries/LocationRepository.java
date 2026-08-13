package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {
    // today
    Location findByUserAndIsPrimaryTrue(com.zepto.zepto_backend.models.User user);
}
