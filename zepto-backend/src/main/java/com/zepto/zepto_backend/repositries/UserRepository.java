package com.zepto.zepto_backend.repositries;

import com.zepto.zepto_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findById(UUID userId);

    Optional<User> findByEmail(String email);

}
