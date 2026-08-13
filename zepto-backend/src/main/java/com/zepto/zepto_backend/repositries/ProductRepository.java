package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.Product;
import org.hibernate.mapping.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByUser_Id(UUID userId);

    List<Product> findByProductNameContainingIgnoreCase(String productName);

    List<Product> findByProductNameStartingWithIgnoreCase(String productName);

    @Query("SELECT p FROM Product p WHERE EXISTS (SELECT 1 FROM WareHouseItem wi WHERE wi.pid = p.id AND wi.totalQuantity > 0)")
    List<Product> findAssignedProducts();

    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%')) AND EXISTS (SELECT 1 FROM WareHouseItem wi WHERE wi.pid = p.id AND wi.totalQuantity > 0)")
    List<Product> searchAssignedProductsByName(String productName);

    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:productName, '%')) AND EXISTS (SELECT 1 FROM WareHouseItem wi WHERE wi.pid = p.id AND wi.totalQuantity > 0)")
    List<Product> searchAssignedProductsStartingWith(String productName);

}
