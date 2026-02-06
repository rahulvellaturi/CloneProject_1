package com.facebookclone.service;

import com.facebookclone.dto.CommentDTO;
import com.facebookclone.model.Comment;
import com.facebookclone.model.Post;
import com.facebookclone.model.User;
import com.facebookclone.repository.CommentRepository;
import com.facebookclone.repository.PostRepository;
import com.facebookclone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public CommentDTO createComment(Long userId, Long postId, CommentDTO commentDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setUser(user);
        comment.setPost(post);
        
        if (commentDTO.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentDTO.getParentCommentId())
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }
        
        comment = commentRepository.save(comment);
        
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        
        return convertToDTO(comment);
    }
    
    public List<CommentDTO> getPostComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        List<Comment> topLevelComments = comments.stream()
            .filter(c -> c.getParentComment() == null)
            .collect(Collectors.toList());
        
        return topLevelComments.stream()
            .map(this::convertToDTOWithReplies)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentDTO updateComment(Long commentId, Long userId, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        comment.setContent(commentDTO.getContent());
        comment = commentRepository.save(comment);
        
        return convertToDTO(comment);
    }
    
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        Post post = comment.getPost();
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);
        
        commentRepository.delete(comment);
    }
    
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setUserProfilePicture(comment.getUser().getProfilePicture());
        dto.setPostId(comment.getPost().getId());
        dto.setCreatedAt(comment.getCreatedAt());
        
        if (comment.getParentComment() != null) {
            dto.setParentCommentId(comment.getParentComment().getId());
        }
        
        return dto;
    }
    
    private CommentDTO convertToDTOWithReplies(Comment comment) {
        CommentDTO dto = convertToDTO(comment);
        
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
        dto.setReplies(replies.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList()));
        
        return dto;
    }
}
