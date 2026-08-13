package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.UserLoginRequestBody;
import com.zepto.zepto_backend.dtos.UserLoginResponseBody;
import com.zepto.zepto_backend.dtos.UserResponseDTO;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.security.JwtUtil;
import com.zepto.zepto_backend.services.UserService;
import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;
    @Autowired
    MappingUtility mappingUtility;

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody UserLoginRequestBody body) {

        User user = userService.isValidEmailPassword(
                body.getEmail(),
                body.getPassword());

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Credentials");
        }
        String token = jwtUtil.generateToken(user);
        UserResponseDTO userDto = mappingUtility.mapUserToUserResponseDTO(user);

        UserLoginResponseBody response = new UserLoginResponseBody();
        response.setUser(userDto);
        response.setToken(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    public String ping() {
        return "User API is running";
    }

    @Autowired
    private com.zepto.zepto_backend.services.LocationService locationService;

    @GetMapping("/address")
    public ResponseEntity<?> getUserAddress(java.security.Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            com.zepto.zepto_backend.models.Location location = locationService.getLocationByUser(user);
            if (location == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found");
            }
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/address")
    public ResponseEntity<?> updateUserAddress(@RequestBody com.zepto.zepto_backend.models.Location locationRequest,
            java.security.Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            com.zepto.zepto_backend.models.Location existingLocation = locationService.getLocationByUser(user);

            if (existingLocation == null) {
                // Should ideally create one, but for now let's update if exists or create new
                // attached to user
                existingLocation = new com.zepto.zepto_backend.models.Location();
                existingLocation.setUser(user);
                existingLocation.setIsPrimary(true);
            }

            existingLocation.setAddressLine1(locationRequest.getAddressLine1());
            existingLocation.setAddressLine2(locationRequest.getAddressLine2());
            existingLocation.setCity(locationRequest.getCity());
            existingLocation.setState(locationRequest.getState());
            existingLocation.setPinCode(locationRequest.getPinCode());
            existingLocation.setCountry(locationRequest.getCountry());

            locationService.updateLocation(existingLocation);
            return ResponseEntity.ok("Address updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
