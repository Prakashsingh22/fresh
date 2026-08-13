package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.dtos.InviteAdminRequestBody;
import com.zepto.zepto_backend.enums.UserStatus;
import com.zepto.zepto_backend.enums.UserType;
import com.zepto.zepto_backend.exceptions.UnAuthorizedException;
import com.zepto.zepto_backend.exceptions.UserNotFoundException;
import com.zepto.zepto_backend.models.User;

import com.zepto.zepto_backend.utility.MappingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WareHouseAdminService {
    @Autowired
    UserService userService;
    @Autowired
    MappingUtility mappingUtility;
    @Autowired
    MailService mailService;

    public void inviteWareHouseAdmin(InviteAdminRequestBody inviteAdminRequestBody, User user) {
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!userService.isAdmin(user)) {
            throw new UnAuthorizedException(String.format(
                    "User with id %s is not allowed to perform invite-warehouse-admin", user.getId().toString()));
        }
        User wareHouseAdmin = mappingUtility.mapInviteAdminToUser(inviteAdminRequestBody,
                UserType.WAREHOUSE_ADMIN.toString());
        userService.saveUser(wareHouseAdmin);
        mailService.sendMailToInviteAdmin(wareHouseAdmin, user.getUserName(), UserType.WAREHOUSE_ADMIN.toString());

    }

    public void acceptInvite(UUID userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found!");
        }
        user.setStatus(UserStatus.ACTIVE.toString());
        userService.updateUser(user);
    }

    public void rejectInvite(UUID userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found!");
        }
        user.setStatus(UserStatus.DELETED.toString());
        userService.deleteUser(user);
    }
}
