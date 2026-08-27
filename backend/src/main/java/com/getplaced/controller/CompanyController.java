package com.getplaced.controller;

import com.getplaced.entity.Company;
import com.getplaced.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping
    public ResponseEntity<Company> addCompany(@RequestParam("name") String name,
                                               @RequestParam(value = "logo", required = false) MultipartFile logo) {
        return ResponseEntity.ok(companyService.addCompany(name, logo));
    }
}
