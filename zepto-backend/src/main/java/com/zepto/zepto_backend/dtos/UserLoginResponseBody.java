package com.zepto.zepto_backend.dtos;

import com.zepto.zepto_backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponseBody {
      private UserResponseDTO user;
      private String token;

}
