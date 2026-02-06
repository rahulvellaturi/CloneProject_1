package com.facebookclone.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private Long userId;
    private String userName;
    private String userProfilePicture;
    private Long postId;
    private Long parentCommentId;
    private LocalDateTime createdAt;
    private List<CommentDTO> replies;
}
