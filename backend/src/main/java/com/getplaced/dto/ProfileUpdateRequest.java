package com.getplaced.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String designation;
    private String companyEmail;
    private String jobId;

    // Candidate fields
    private String education;
    private String experiences;
    private String location;
    private String currentOrganization;
    private String currentCtc;
    private String expectedCtc;
    private String interests;
    private String resumeUrl;
    private String avatarUrl;

    // Company details
    private String companyName;
    private String branches;
    private String industryType;
    private Long companyId;
}
