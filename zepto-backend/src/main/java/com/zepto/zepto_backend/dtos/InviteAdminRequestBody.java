package com.zepto.zepto_backend.dtos;

import com.zepto.zepto_backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteAdminRequestBody {
    private String userName;
    private String email;
    private String phoneNumber;
    private String role;

}
