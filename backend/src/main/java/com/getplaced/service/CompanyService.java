package com.getplaced.service;

import com.getplaced.entity.Company;
import com.getplaced.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company addCompany(String name, MultipartFile logo) {
        String logoUrl = null;
        if (logo != null && !logo.isEmpty()) {
            logoUrl = fileStorageService.storeFile(logo, "logos");
        }

        Company company = Company.builder()
                .name(name)
                .logoUrl(logoUrl)
                .build();

        return companyRepository.save(company);
    }
}
