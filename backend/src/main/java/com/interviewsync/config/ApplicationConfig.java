package com.interviewsync.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApplicationConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);

        registry.addMapping("/api-docs/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET")
                .allowedHeaders("*");

        registry.addMapping("/swagger-ui/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET")
                .allowedHeaders("*");
    }
}
