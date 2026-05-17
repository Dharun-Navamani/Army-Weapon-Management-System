package com.military.awms.service;

import com.military.awms.dto.request.AmmunitionRequest;
import com.military.awms.exception.ResourceNotFoundException;
import com.military.awms.model.AmmunitionStock;
import com.military.awms.repository.AmmunitionStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AmmunitionService {

    @Autowired
    private AmmunitionStockRepository ammoRepository;

    @Autowired
    private AuditService auditService;

    public List<AmmunitionStock> getAllStock() {
        return ammoRepository.findAll();
    }

    public AmmunitionStock getStockById(Long id) {
        return ammoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AmmunitionStock", "id", id));
    }

    public List<AmmunitionStock> getLowStock() {
        return ammoRepository.findLowStock();
    }

    public AmmunitionStock createStock(AmmunitionRequest request) {
        AmmunitionStock stock = AmmunitionStock.builder()
                .name(request.getName())
                .ammoType(request.getAmmoType())
                .caliber(request.getCaliber())
                .quantity(request.getQuantity())
                .reorderThreshold(request.getReorderThreshold() != null ? request.getReorderThreshold() : 100)
                .unitOfMeasure(request.getUnitOfMeasure() != null ? request.getUnitOfMeasure() : "rounds")
                .location(request.getLocation())
                .lastRestocked(LocalDateTime.now())
                .build();
        AmmunitionStock saved = ammoRepository.save(stock);
        auditService.logAction("CREATE", "AmmunitionStock", saved.getId(), null, "Created ammo: " + saved.getName());
        return saved;
    }

    public AmmunitionStock updateStock(Long id, AmmunitionRequest request) {
        AmmunitionStock stock = getStockById(id);
        String oldInfo = stock.getName() + " qty:" + stock.getQuantity();
        if (request.getName() != null) stock.setName(request.getName());
        if (request.getAmmoType() != null) stock.setAmmoType(request.getAmmoType());
        if (request.getCaliber() != null) stock.setCaliber(request.getCaliber());
        if (request.getQuantity() != null) {
            stock.setQuantity(request.getQuantity());
            stock.setLastRestocked(LocalDateTime.now());
        }
        if (request.getReorderThreshold() != null) stock.setReorderThreshold(request.getReorderThreshold());
        if (request.getUnitOfMeasure() != null) stock.setUnitOfMeasure(request.getUnitOfMeasure());
        if (request.getLocation() != null) stock.setLocation(request.getLocation());
        AmmunitionStock updated = ammoRepository.save(stock);
        auditService.logAction("UPDATE", "AmmunitionStock", id, oldInfo, updated.getName() + " qty:" + updated.getQuantity());
        return updated;
    }

    public void deleteStock(Long id) {
        AmmunitionStock stock = getStockById(id);
        auditService.logAction("DELETE", "AmmunitionStock", id, "Deleted: " + stock.getName(), null);
        ammoRepository.delete(stock);
    }
}
