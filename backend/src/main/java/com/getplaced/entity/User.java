package com.getplaced.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.getplaced.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String avatarUrl;

    private String designation;

    private String companyEmail;

    private String jobId;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String experiences;

    private String location;

    private String currentOrganization;

    private String currentCtc;

    private String expectedCtc;

    @Column(columnDefinition = "TEXT")
    private String interests;

    private String resumeUrl;

    @Builder.Default
    private Boolean profileCompleted = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    private Company company;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
