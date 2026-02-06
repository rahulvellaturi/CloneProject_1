package com.facebookclone.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostDTO {
    private Long id;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private Long userId;
    private String userName;
    private String userProfilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLiked;
    private String reactionType;
}
