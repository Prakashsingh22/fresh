package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.Order;
import com.zepto.zepto_backend.models.WareHouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByConsumer_Id(UUID consumerId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o JOIN OrderItem oi ON o.id = oi.oid WHERE oi.wid = :wareHouseId")
    List<Order> findByWareHouse_Id(UUID wareHouseId);

}
