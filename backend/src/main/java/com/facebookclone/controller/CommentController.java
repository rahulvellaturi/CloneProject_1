package com.facebookclone.controller;

import com.facebookclone.dto.CommentDTO;
import com.facebookclone.model.User;
import com.facebookclone.repository.UserRepository;
import com.facebookclone.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        CommentDTO comment = commentService.createComment(user.getId(), postId, commentDTO);
        return ResponseEntity.ok(comment);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getPostComments(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getPostComments(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @RequestBody CommentDTO commentDTO,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        CommentDTO comment = commentService.updateComment(id, user.getId(), commentDTO);
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        commentService.deleteComment(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
