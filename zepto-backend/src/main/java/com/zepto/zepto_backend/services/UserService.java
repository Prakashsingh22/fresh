package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.UserResponseDTO;
import com.zepto.zepto_backend.enums.UserType;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.repositries.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public User saveUser(User user) {
        return this.userRepository.save(user);
    }

    public User getUserById(UUID userId) {
        return this.userRepository.findById(userId).orElse(null);
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElse(null);
    }

    public boolean isMeintUser(User user) {
        return user.getUserType().equals(UserType.MEINT.toString());
    }

    public boolean isAppAdmin(User user) {
        return user.getUserType().equals(UserType.ZEPTO_APP_ADMIN.toString());
    }

    public boolean isAdmin(User user) {
        if (user == null || user.getUserType() == null)
            return false;
        String type = user.getUserType();
        return type.equals(UserType.MEINT.name()) || type.equals(UserType.ZEPTO_APP_ADMIN.name());
    }

    public boolean isWarehouseAdmin(User user) {
        if (user == null || user.getUserType() == null)
            return false;
        return user.getUserType().equals(UserType.WAREHOUSE_ADMIN.name());
    }

    public boolean isInternalUser(User user) {
        return isAdmin(user) || isWarehouseAdmin(user);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public User isValidEmailPassword(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!user.getPassword().equals(password)) {
            return null; // invalid password
        }

        return user;
    }

}
