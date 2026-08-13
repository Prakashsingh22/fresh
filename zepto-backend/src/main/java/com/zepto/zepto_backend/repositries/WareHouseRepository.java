package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.WareHouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WareHouseRepository extends JpaRepository<WareHouse, UUID> {
    Optional<WareHouse> findFirstByOrderByCreatedAtAsc();
    Optional<WareHouse> findByWareHouseAdmin_Id(UUID userId);

    //today
//
//    @Query("""
//        SELECT w FROM WareHouse w
//        WHERE w.location.pinCode IN :pincodes
//    """)
//    List<WareHouse> findByNearbyPincodes(List<String> pincodes);
}
