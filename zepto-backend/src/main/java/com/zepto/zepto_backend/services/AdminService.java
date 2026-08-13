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
public class AdminService {
    @Autowired
    MappingUtility mappingUtility;
    @Autowired
    UserService userService;
    @Autowired
    MailService mailService;

    public void inviteAdmin(InviteAdminRequestBody inviteAdminRequestBody, User meintUser) {
        if (meintUser == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!userService.isAdmin(meintUser)) {
            throw new UnAuthorizedException(
                    String.format("User id %s is not valid for invite-admin operation", meintUser.getId().toString()));
        }
        User admin = mappingUtility.mapInviteAdminToUser(inviteAdminRequestBody, UserType.ZEPTO_APP_ADMIN.toString());
        admin = userService.saveUser(admin);
        mailService.sendMailToInviteAdmin(admin, meintUser.getUserName(), UserType.ZEPTO_APP_ADMIN.toString());
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
