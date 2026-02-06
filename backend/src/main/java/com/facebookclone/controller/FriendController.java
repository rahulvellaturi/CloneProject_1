package com.facebookclone.controller;

import com.facebookclone.model.FriendRequest;
import com.facebookclone.model.User;
import com.facebookclone.repository.UserRepository;
import com.facebookclone.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendController {
    
    @Autowired
    private FriendService friendService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Void> sendFriendRequest(
            @PathVariable Long receiverId,
            Authentication authentication) {
        User sender = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        friendService.sendFriendRequest(sender.getId(), receiverId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/accept/{requestId}")
    public ResponseEntity<Void> acceptFriendRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        friendService.acceptFriendRequest(requestId, user.getId());
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/decline/{requestId}")
    public ResponseEntity<Void> declineFriendRequest(
            @PathVariable Long requestId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        friendService.declineFriendRequest(requestId, user.getId());
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{friendId}")
    public ResponseEntity<Void> removeFriend(
            @PathVariable Long friendId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        friendService.removeFriend(user.getId(), friendId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequest>> getPendingRequests(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<FriendRequest> requests = friendService.getPendingRequests(user.getId());
        return ResponseEntity.ok(requests);
    }
}
