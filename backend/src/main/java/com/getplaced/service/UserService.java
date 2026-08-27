package com.getplaced.service;

import com.getplaced.dto.ProfileUpdateRequest;
import com.getplaced.entity.Company;
import com.getplaced.entity.User;
import com.getplaced.repository.CompanyRepository;
import com.getplaced.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;

    public User updateProfile(String userEmail, ProfileUpdateRequest request, MultipartFile logo, MultipartFile avatar, MultipartFile resume) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getDesignation() != null) {
            user.setDesignation(request.getDesignation());
        }
        if (request.getCompanyEmail() != null) {
            user.setCompanyEmail(request.getCompanyEmail());
        }
        if (request.getJobId() != null) {
            user.setJobId(request.getJobId());
        }

        // Candidate details
        if (request.getEducation() != null) {
            user.setEducation(request.getEducation());
        }
        if (request.getExperiences() != null) {
            user.setExperiences(request.getExperiences());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getCurrentOrganization() != null) {
            user.setCurrentOrganization(request.getCurrentOrganization());
        }
        if (request.getCurrentCtc() != null) {
            user.setCurrentCtc(request.getCurrentCtc());
        }
        if (request.getExpectedCtc() != null) {
            user.setExpectedCtc(request.getExpectedCtc());
        }
        if (request.getInterests() != null) {
            user.setInterests(request.getInterests());
        }

        // Handle Avatar File Upload
        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = fileStorageService.storeFile(avatar, "avatars");
            user.setAvatarUrl(avatarUrl);
        } else if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        // Handle Resume File Upload
        if (resume != null && !resume.isEmpty()) {
            String resumeUrl = fileStorageService.storeFile(resume, "resumes");
            user.setResumeUrl(resumeUrl);
        } else if (request.getResumeUrl() != null && !request.getResumeUrl().isBlank()) {
            user.setResumeUrl(request.getResumeUrl());
        }

        // Handle Company creation/update if provided (for Recruiters)
        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            Company company;
            if (user.getCompany() != null) {
                company = user.getCompany();
                company.setName(request.getCompanyName());
            } else if (request.getCompanyId() != null) {
                company = companyRepository.findById(request.getCompanyId())
                        .orElse(new Company());
                company.setName(request.getCompanyName());
            } else {
                company = companyRepository.findByName(request.getCompanyName().trim())
                        .orElseGet(() -> {
                            Company c = new Company();
                            c.setName(request.getCompanyName().trim());
                            return c;
                        });
            }

            if (request.getBranches() != null) {
                company.setBranches(request.getBranches());
            }
            if (request.getIndustryType() != null) {
                company.setIndustryType(request.getIndustryType());
            }

            if (logo != null && !logo.isEmpty()) {
                String logoUrl = fileStorageService.storeFile(logo, "logos");
                company.setLogoUrl(logoUrl);
            } else if (company.getLogoUrl() == null) {
                company.setLogoUrl("/logo.png");
            }

            Company savedCompany = companyRepository.save(company);
            user.setCompany(savedCompany);
        }

        user.setProfileCompleted(true);
        return userRepository.save(user);
    }

    public User getUserProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
