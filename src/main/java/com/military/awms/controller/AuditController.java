package com.military.awms.controller;

import com.military.awms.model.AuditLog;
import com.military.awms.service.AuditService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Audit Trail", description = "Audit log viewing")
@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(auditService.getAllLogs());
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<AuditLog>> getRecent(@RequestParam(defaultValue = "20") int count) {
        return ResponseEntity.ok(auditService.getRecentLogs(count));
    }

    @GetMapping("/entity/{entityType}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<AuditLog>> getByEntity(@PathVariable String entityType) {
        return ResponseEntity.ok(auditService.getLogsByEntity(entityType));
    }

    @GetMapping("/user/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getByUser(@PathVariable String username) {
        return ResponseEntity.ok(auditService.getLogsByUser(username));
    }
}
