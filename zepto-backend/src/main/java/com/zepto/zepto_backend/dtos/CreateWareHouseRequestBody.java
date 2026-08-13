package com.zepto.zepto_backend.dtos;

import com.zepto.zepto_backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateWareHouseRequestBody {
    private String wareHouseName;
    private String wareHouseEmail;
    private String wareHouseContactNumber;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String city;
    private String state;
    private String country;
    private String pinCode;
    private Boolean isPrimary;

}
