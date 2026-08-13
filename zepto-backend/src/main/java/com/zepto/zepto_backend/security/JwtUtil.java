package com.zepto.zepto_backend.security;

import com.zepto.zepto_backend.models.User;
import com.zepto.zepto_backend.services.UserService;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${security.secret.password}")
    String SECRET_KEY;
    @Autowired
    UserService userService;


    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24; // 24 hours

    //    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//    }
    // Only store IDENTIFIER (email / username)
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userType", user.getUserType()) // 👈 ADD THIS
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }



    public String decryptJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
    @PostConstruct
    public void checkSecret() {
        System.out.println("JWT SECRET LOADED = " + (SECRET_KEY != null));
    }


}
