package com.zepto.zepto_backend.controllers;

import com.zepto.zepto_backend.dtos.InviteAdminRequestBody;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.services.UserService;
import com.zepto.zepto_backend.services.WareHouseAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/warehouse-admin")
public class WarehouseController {

    @Autowired
    WareHouseAdminService wareHouseAdminService;

    @Autowired
    UserService userService;

    @PostMapping("/invite")
    public ResponseEntity<?> inviteWareHouseAdmin(@RequestBody InviteAdminRequestBody inviteAdminRequestBody,
            Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            wareHouseAdminService.inviteWareHouseAdmin(inviteAdminRequestBody, user);
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
            wareHouseAdminService.acceptInvite(userId);
            return new ResponseEntity<>("User accepted invitation successfully", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("invite/reject/{userId}")
    public ResponseEntity<?> rejectInvite(@PathVariable UUID userId) {
        try {
            wareHouseAdminService.rejectInvite(userId);
            return new ResponseEntity<>("User rejected invitation successfully", HttpStatus.CREATED);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
