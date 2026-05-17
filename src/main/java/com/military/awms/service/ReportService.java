package com.military.awms.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.military.awms.model.Weapon;
import com.military.awms.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * PDF Report generation service using iText 7.
 */
@Service
public class ReportService {

    @Autowired private WeaponRepository weaponRepository;

    public byte[] generateWeaponReport() {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        // Title
        doc.add(new Paragraph("ARMY WEAPON MANAGEMENT SYSTEM")
                .setFontSize(20).setBold().setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph("Weapon Inventory Report")
                .setFontSize(14).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph("Generated: " + LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")))
                .setFontSize(10).setTextAlignment(TextAlignment.CENTER));
        doc.add(new Paragraph("\n"));

        // Table
        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 3, 2, 2, 2, 1, 2}));
        table.setWidth(UnitValue.createPercentValue(100));

        // Headers
        String[] headers = {"#", "Name", "Serial No.", "Type", "Caliber", "Qty", "Status"};
        for (String h : headers) {
            Cell cell = new Cell().add(new Paragraph(h).setBold());
            cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
            table.addHeaderCell(cell);
        }

        // Data rows
        List<Weapon> weapons = weaponRepository.findAll();
        int i = 1;
        for (Weapon w : weapons) {
            table.addCell(String.valueOf(i++));
            table.addCell(w.getName());
            table.addCell(w.getSerialNumber());
            table.addCell(w.getWeaponType());
            table.addCell(w.getCaliber() != null ? w.getCaliber() : "-");
            table.addCell(String.valueOf(w.getQuantity()));
            table.addCell(w.getStatus().toString());
        }

        doc.add(table);
        doc.add(new Paragraph("\nTotal Weapons: " + weapons.size()).setBold());
        doc.add(new Paragraph("--- END OF REPORT ---")
                .setTextAlignment(TextAlignment.CENTER).setFontSize(10));
        doc.close();
        return baos.toByteArray();
    }
}
