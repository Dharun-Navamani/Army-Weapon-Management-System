package com.military.awms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI Configuration for auto-generated API documentation.
 * 
 * Access the interactive API docs at: http://localhost:8080/swagger-ui.html
 * Includes JWT Bearer token authentication support in the Swagger UI.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI awmsOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Army Weapon Management System API")
                        .description("RESTful API for managing military weapon inventory, " +
                                "assignments, maintenance, ammunition, missions, and audit trails.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("AWMS Development Team")
                                .email("admin@army.mil")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
