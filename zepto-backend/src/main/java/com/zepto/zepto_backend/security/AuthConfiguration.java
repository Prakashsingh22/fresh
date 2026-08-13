package com.zepto.zepto_backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

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
                                .cors(org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer::disable) // Disable
                                                                                                                                      // default
                                                                                                                                      // CORS
                                                                                                                                      // to
                                                                                                                                      // use
                                                                                                                                      // our
                                                                                                                                      // custom
                                                                                                                                      // bean
                                .sessionManagement(
                                                session -> session
                                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
                                                .permitAll()
                                                .requestMatchers(
                                                                "/api/v1/health",
                                                                "/api/v1/user/login",
                                                                "/api/v1/consumer/create-account",
                                                                "/api/v1/admin/invite/accept/**",
                                                                "/api/v1/admin/invite/reject/**",
                                                                "/api/v1/warehouse-admin/invite/accept/**",
                                                                "/api/v1/warehouse-admin/invite/reject/**")
                                                .permitAll()

                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/v1/product/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/api/v1/warehouse-admin/**",
                                                                "/api/v1/warehouse/**",
                                                                "/api/v1/admin/**")
                                                .hasAnyAuthority(
                                                                "MEINT",
                                                                "ZEPTO_APP_ADMIN",
                                                                "WAREHOUSE_ADMIN")

                                                .requestMatchers("/api/v1/product/**")
                                                .hasAnyAuthority(
                                                                "MEINT",
                                                                "ZEPTO_APP_ADMIN",
                                                                "WAREHOUSE_ADMIN",
                                                                "CONSUMER")

                                                .anyRequest().authenticated()

                                )
                                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();

        }

        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(List.of("*"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return new CorsFilter(source);
        }
}
