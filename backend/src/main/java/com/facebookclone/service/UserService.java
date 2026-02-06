package com.facebookclone.service;

import com.facebookclone.dto.UserDTO;
import com.facebookclone.model.FriendRequest;
import com.facebookclone.model.User;
import com.facebookclone.repository.FriendRequestRepository;
import com.facebookclone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    
    public UserDTO getUserById(Long userId, Long currentUserId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return convertToDTO(user, currentUserId);
    }
    
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return convertToDTO(user, user.getId());
    }
    
    public List<UserDTO> searchUsers(String query) {
        List<User> users = userRepository.searchUsers(query);
        return users.stream()
            .map(user -> convertToDTO(user, null))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public UserDTO updateUser(Long userId, UserDTO userDTO, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (!currentUser.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (userDTO.getBio() != null) user.setBio(userDTO.getBio());
        if (userDTO.getLocation() != null) user.setLocation(userDTO.getLocation());
        if (userDTO.getWork() != null) user.setWork(userDTO.getWork());
        if (userDTO.getEducation() != null) user.setEducation(userDTO.getEducation());
        if (userDTO.getProfilePicture() != null) user.setProfilePicture(userDTO.getProfilePicture());
        if (userDTO.getCoverPhoto() != null) user.setCoverPhoto(userDTO.getCoverPhoto());
        
        user = userRepository.save(user);
        return convertToDTO(user, userId);
    }
    
    private UserDTO convertToDTO(User user, Long currentUserId) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setFullName(user.getFullName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCoverPhoto(user.getCoverPhoto());
        dto.setBio(user.getBio());
        dto.setLocation(user.getLocation());
        dto.setWork(user.getWork());
        dto.setEducation(user.getEducation());
        dto.setCreatedAt(user.getCreatedAt());
        
        if (currentUserId != null && !user.getId().equals(currentUserId)) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                dto.setIsFriend(currentUser.getFriends().contains(user));
                
                FriendRequest sentRequest = friendRequestRepository
                    .findBySenderAndReceiver(currentUser, user).orElse(null);
                FriendRequest receivedRequest = friendRequestRepository
                    .findBySenderAndReceiver(user, currentUser).orElse(null);
                
                dto.setFriendRequestSent(sentRequest != null && 
                    sentRequest.getStatus() == FriendRequest.Status.PENDING);
                dto.setFriendRequestReceived(receivedRequest != null && 
                    receivedRequest.getStatus() == FriendRequest.Status.PENDING);
            }
        }
        
        return dto;
    }
}
