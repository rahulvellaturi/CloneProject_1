package com.facebookclone.controller;

import com.facebookclone.dto.PostDTO;
import com.facebookclone.model.User;
import com.facebookclone.repository.UserRepository;
import com.facebookclone.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        PostDTO createdPost = postService.createPost(user.getId(), postDTO);
        return ResponseEntity.ok(createdPost);
    }
    
    @GetMapping("/feed")
    public ResponseEntity<Page<PostDTO>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDTO> feed = postService.getFeed(user.getId(), pageable);
        return ResponseEntity.ok(feed);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostDTO>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PostDTO> posts = postService.getUserPosts(userId, pageable);
        return ResponseEntity.ok(posts);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody PostDTO postDTO,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        PostDTO updatedPost = postService.updatePost(id, user.getId(), postDTO);
        return ResponseEntity.ok(updatedPost);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        postService.deletePost(id, user.getId());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<PostDTO> likePost(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        PostDTO post = postService.likePost(id, user.getId());
        return ResponseEntity.ok(post);
    }
}
