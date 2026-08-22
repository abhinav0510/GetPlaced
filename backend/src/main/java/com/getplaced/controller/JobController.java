package com.getplaced.controller;

import com.getplaced.dto.JobRequest;
import com.getplaced.entity.Job;
import com.getplaced.security.UserPrincipal;
import com.getplaced.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getJobs(@RequestParam(required = false) String location,
                                             @RequestParam(required = false) Long companyId,
                                             @RequestParam(required = false) String searchQuery) {
        return ResponseEntity.ok(jobService.getJobs(location, companyId, searchQuery));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest request,
                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(jobService.createJob(request, userPrincipal.getEmail()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Job> updateHiringStatus(@PathVariable Long id,
                                                  @RequestParam Boolean isOpen) {
        return ResponseEntity.ok(jobService.updateHiringStatus(id, isOpen));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(jobService.getMyJobs(userPrincipal.getEmail()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
