package com.facebookclone.repository;

import com.facebookclone.model.Post;
import com.facebookclone.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user IN :friends OR p.user = :user ORDER BY p.createdAt DESC")
    Page<Post> findFeedPosts(@Param("user") User user, @Param("friends") List<User> friends, Pageable pageable);
    
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
}
