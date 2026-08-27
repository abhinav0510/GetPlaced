package com.getplaced.controller;

import com.getplaced.entity.Application;
import com.getplaced.enums.ApplicationStatus;
import com.getplaced.security.UserPrincipal;
import com.getplaced.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> applyToJob(@RequestParam("jobId") Long jobId,
                                                   @RequestParam(value = "resume", required = false) MultipartFile resume,
                                                   @RequestParam(value = "resumeUrl", required = false) String existingResumeUrl,
                                                   @RequestParam(value = "skills", required = false) String skills,
                                                   @RequestParam(value = "experience", required = false) String experience,
                                                   @RequestParam(value = "education", required = false) String education,
                                                   @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(applicationService.applyToJob(jobId, userPrincipal.getEmail(), resume, existingResumeUrl, skills, experience, education));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
                                                     @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getCandidateApplications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(applicationService.getCandidateApplications(userPrincipal.getEmail()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplications(jobId));
    }
}
