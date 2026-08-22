package com.getplaced.repository;

import com.getplaced.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterId(Long recruiterId);

    @Query("SELECT j FROM Job j WHERE " +
            "(:location IS NULL OR :location = '' OR LOWER(j.location) = LOWER(:location)) AND " +
            "(:companyId IS NULL OR j.company.id = :companyId) AND " +
            "(:searchQuery IS NULL OR :searchQuery = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    List<Job> searchJobs(@Param("location") String location,
                         @Param("companyId") Long companyId,
                         @Param("searchQuery") String searchQuery);
}
