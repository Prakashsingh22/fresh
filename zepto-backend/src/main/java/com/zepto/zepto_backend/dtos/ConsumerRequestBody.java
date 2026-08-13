package com.zepto.zepto_backend.dtos;


//import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
//import com.zepto.zepto_backend.config.BooleanDeserializer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumerRequestBody {
    private String userName;
    private String email;
    private String password;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String city;
    private String state;
    private String country;
    private String pinCode;
    private Boolean isPrimary;
}
