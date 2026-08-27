package com.getplaced.service;

import com.getplaced.entity.Application;
import com.getplaced.entity.Job;
import com.getplaced.entity.User;
import com.getplaced.enums.ApplicationStatus;
import com.getplaced.repository.ApplicationRepository;
import com.getplaced.repository.JobRepository;
import com.getplaced.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public Application applyToJob(Long jobId, String candidateEmail, MultipartFile resume, String existingResumeUrl, String skills, String experience, String education) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String finalResumeUrl = null;
        if (resume != null && !resume.isEmpty()) {
            finalResumeUrl = fileStorageService.storeFile(resume, "resumes");
        } else if (existingResumeUrl != null && !existingResumeUrl.isBlank()) {
            finalResumeUrl = existingResumeUrl;
        } else if (candidate.getResumeUrl() != null && !candidate.getResumeUrl().isBlank()) {
            finalResumeUrl = candidate.getResumeUrl();
        }

        if (finalResumeUrl == null || finalResumeUrl.isBlank()) {
            throw new RuntimeException("Please upload a resume or select your profile resume to apply.");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .resumeUrl(finalResumeUrl)
                .skills(skills)
                .experience(experience)
                .education(education)
                .build();

        return applicationRepository.save(application);
    }

    public Application updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public List<Application> getCandidateApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidateId(candidate.getId());
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}
