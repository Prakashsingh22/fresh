package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.WareHouse;
import com.zepto.zepto_backend.models.WareHouseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WareHouseItemRepository extends JpaRepository<WareHouseItem, UUID> {

    List<WareHouseItem> findByPid(UUID pid);

    @Query("SELECT SUM(wi.totalQuantity) FROM WareHouseItem wi WHERE wi.pid = :pid")
    Long sumTotalQuantityByPid(UUID pid);

    Optional<WareHouseItem> findByWidAndPid(UUID wid, UUID pid);
}
