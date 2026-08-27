package com.getplaced.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.getplaced.dto.ProfileUpdateRequest;
import com.getplaced.entity.User;
import com.getplaced.security.UserPrincipal;
import com.getplaced.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getUserProfile(userPrincipal.getEmail()));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "resume", required = false) MultipartFile resume
    ) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            ProfileUpdateRequest request = objectMapper.readValue(dataJson, ProfileUpdateRequest.class);
            User updatedUser = userService.updateProfile(userPrincipal.getEmail(), request, logo, avatar, resume);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
