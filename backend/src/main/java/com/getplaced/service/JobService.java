package com.getplaced.service;

import com.getplaced.dto.JobRequest;
import com.getplaced.entity.Company;
import com.getplaced.entity.Job;
import com.getplaced.entity.User;
import com.getplaced.repository.CompanyRepository;
import com.getplaced.repository.JobRepository;
import com.getplaced.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public List<Job> getJobs(String location, Long companyId, String searchQuery) {
        return jobRepository.searchJobs(location, companyId, searchQuery);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    public Job createJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            if (request.getCompanyId() != null) {
                company = companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new RuntimeException("Company not found"));
            } else {
                throw new RuntimeException("No company linked to recruiter profile. Please update your profile.");
            }
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .salary(request.getSalary())
                .experience(request.getExperience())
                .company(company)
                .recruiter(recruiter)
                .isOpen(request.getIsOpen() != null ? request.getIsOpen() : true)
                .build();

        return jobRepository.save(job);
    }

    public Job updateHiringStatus(Long id, Boolean isOpen) {
        Job job = getJobById(id);
        job.setIsOpen(isOpen);
        return jobRepository.save(job);
    }

    public List<Job> getMyJobs(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiterId(recruiter.getId());
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
