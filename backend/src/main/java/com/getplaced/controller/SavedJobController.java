package com.getplaced.controller;

import com.getplaced.entity.Job;
import com.getplaced.entity.SavedJob;
import com.getplaced.entity.User;
import com.getplaced.repository.JobRepository;
import com.getplaced.repository.SavedJobRepository;
import com.getplaced.repository.UserRepository;
import com.getplaced.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SavedJob>> getSavedJobs(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(savedJobRepository.findByUserId(user.getId()));
    }

    @PostMapping("/toggle/{jobId}")
    @Transactional
    public ResponseEntity<Boolean> toggleSaveJob(@PathVariable Long jobId,
                                                  @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isSaved = savedJobRepository.existsByJobIdAndUserId(jobId, user.getId());

        if (isSaved) {
            savedJobRepository.deleteByJobIdAndUserId(jobId, user.getId());
            return ResponseEntity.ok(false);
        } else {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            SavedJob savedJob = SavedJob.builder()
                    .job(job)
                    .user(user)
                    .build();
            savedJobRepository.save(savedJob);
            return ResponseEntity.ok(true);
        }
    }
}
