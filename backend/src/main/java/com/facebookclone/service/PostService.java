package com.facebookclone.service;

import com.facebookclone.dto.PostDTO;
import com.facebookclone.model.Like;
import com.facebookclone.model.Post;
import com.facebookclone.model.User;
import com.facebookclone.repository.LikeRepository;
import com.facebookclone.repository.PostRepository;
import com.facebookclone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Transactional
    public PostDTO createPost(Long userId, PostDTO postDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Post post = new Post();
        post.setContent(postDTO.getContent());
        post.setImageUrl(postDTO.getImageUrl());
        post.setVideoUrl(postDTO.getVideoUrl());
        post.setUser(user);
        post.setLikeCount(0);
        post.setCommentCount(0);
        
        post = postRepository.save(post);
        return convertToDTO(post, userId);
    }
    
    public Page<PostDTO> getFeed(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<User> friends = user.getFriends().stream().collect(Collectors.toList());
        Page<Post> posts = postRepository.findFeedPosts(user, friends, pageable);
        
        return posts.map(post -> convertToDTO(post, userId));
    }
    
    public Page<PostDTO> getUserPosts(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Page<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return posts.map(post -> convertToDTO(post, userId));
    }
    
    @Transactional
    public PostDTO updatePost(Long postId, Long userId, PostDTO postDTO) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (postDTO.getContent() != null) post.setContent(postDTO.getContent());
        if (postDTO.getImageUrl() != null) post.setImageUrl(postDTO.getImageUrl());
        if (postDTO.getVideoUrl() != null) post.setVideoUrl(postDTO.getVideoUrl());
        
        post = postRepository.save(post);
        return convertToDTO(post, userId);
    }
    
    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        postRepository.delete(post);
    }
    
    @Transactional
    public PostDTO likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Like existingLike = likeRepository.findByUserAndPost(user, post).orElse(null);
        
        if (existingLike != null) {
            likeRepository.delete(existingLike);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setReactionType(Like.ReactionType.LIKE);
            likeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);
        }
        
        post = postRepository.save(post);
        return convertToDTO(post, userId);
    }
    
    private PostDTO convertToDTO(Post post, Long currentUserId) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setVideoUrl(post.getVideoUrl());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getFullName());
        dto.setUserProfilePicture(post.getUser().getProfilePicture());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setLikeCount(post.getLikeCount());
        dto.setCommentCount(post.getCommentCount());
        
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                Like like = likeRepository.findByUserAndPost(currentUser, post).orElse(null);
                dto.setIsLiked(like != null);
                if (like != null) {
                    dto.setReactionType(like.getReactionType().name());
                }
            }
        }
        
        return dto;
    }
}
