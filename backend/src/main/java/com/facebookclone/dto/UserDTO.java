package com.facebookclone.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String profilePicture;
    private String coverPhoto;
    private String bio;
    private String location;
    private String work;
    private String education;
    private LocalDateTime createdAt;
    private Boolean isFriend;
    private Boolean friendRequestSent;
    private Boolean friendRequestReceived;
}
