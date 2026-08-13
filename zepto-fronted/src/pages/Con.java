package com.zepto.zepto_backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
@EnableWebSecurity
@Configuration
public class AuthConfiguration {

    @Autowired
    AuthFilter authFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // ✅ CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ JWT = STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // 🔓 AUTH / USER
                        .requestMatchers(
                                "/api/v1/user/**",
                                "/api/v1/consumer/**"
                        ).permitAll()

                        // 🔓 CORS PREFLIGHT
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔓 PUBLIC PRODUCTS (READ ONLY)
                        .requestMatchers(HttpMethod.GET, "/api/v1/product/**").permitAll()

                        // 🔐 PRODUCT WRITE (ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/v1/product/**")
                        .hasRole("ZEPTO_APP_ADMIN")

                        // 🔐 MAIN ADMIN
                        .requestMatchers("/api/v1/admin/**")
                        .hasRole("ZEPTO_APP_ADMIN")

                        // 🔐 WAREHOUSE ADMIN
                        .requestMatchers("/api/v1/warehouse-admin/**")
                        .hasRole("ZEPTO_APP_ADMIN")

                        // 🔐 WAREHOUSE OPS
                        .requestMatchers("/api/v1/warehouse/**")
                        .hasAnyRole("MEINT", "ZEPTO_APP_ADMIN")

                        // 🔐 EVERYTHING ELSE
                        .anyRequest().authenticated()
                )


                // ✅ VERY IMPORTANT
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

