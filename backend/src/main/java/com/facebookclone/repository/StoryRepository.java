package com.facebookclone.repository;

import com.facebookclone.model.Story;
import com.facebookclone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByUserAndIsActiveTrueOrderByCreatedAtDesc(User user);
    
    @Query("SELECT s FROM Story s WHERE s.user IN :friends AND s.isActive = true AND s.expiresAt > :now ORDER BY s.createdAt DESC")
    List<Story> findActiveStories(@Param("friends") List<User> friends, @Param("now") LocalDateTime now);
    
    List<Story> findByExpiresAtBeforeAndIsActiveTrue(LocalDateTime now);
}
