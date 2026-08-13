package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.InviteAdminRequestBody;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.services.AdminService;
import com.zepto.zepto_backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @Autowired
    UserService userService;

    @PostMapping("/invite")
    public ResponseEntity<?> createAdmin(@RequestBody InviteAdminRequestBody inviteAdminRequestBody,
            Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            adminService.inviteAdmin(inviteAdminRequestBody, user);
            return new ResponseEntity<>("Mail sent successfully ", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (UnAuthorizedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("invite/accept/{userId}")
    public ResponseEntity<?> acceptInvite(@PathVariable UUID userId) {
        try {
            adminService.acceptInvite(userId);
            return new ResponseEntity<>("User accepted invite successfully", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("invite/reject/{userId}")
    public ResponseEntity<?> rejectInvite(@PathVariable UUID userId) {
        try {
            adminService.rejectInvite(userId);
            return new ResponseEntity<>("User rejected invite successfully", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
