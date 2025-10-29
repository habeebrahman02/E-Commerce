package com.amaterra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for API testing
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/products/**").permitAll() // allow products API
                        .requestMatchers("/users/**").permitAll()    // allow users API
                        .anyRequest().permitAll() // allow everything else for now
                )
                .httpBasic(httpBasic -> {}); // basic auth enabled, but since all permitted, won’t be used

        return http.build();
    }
}
