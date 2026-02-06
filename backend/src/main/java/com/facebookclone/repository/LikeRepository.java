package com.facebookclone.repository;

import com.facebookclone.model.Like;
import com.facebookclone.model.Post;
import com.facebookclone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    Long countByPost(Post post);
    Boolean existsByUserAndPost(User user, Post post);
}
