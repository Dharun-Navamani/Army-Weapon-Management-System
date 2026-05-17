package com.military.awms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Army Weapon Management System - Main Application Entry Point
 * 
 * This system provides comprehensive weapon lifecycle management for military
 * operations including inventory tracking, soldier assignments, maintenance
 * scheduling, ammunition management, and mission logging.
 * 
 * @author AWMS Development Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class AwmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AwmsApplication.class, args);
    }
}
