package com.facebookclone.service;

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
public class FriendService {
    
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public void sendFriendRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }
        
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (sender.getFriends().contains(receiver)) {
            throw new RuntimeException("Already friends");
        }
        
        FriendRequest existingRequest = friendRequestRepository
            .findBySenderAndReceiver(sender, receiver).orElse(null);
        
        if (existingRequest != null && existingRequest.getStatus() == FriendRequest.Status.PENDING) {
            throw new RuntimeException("Friend request already sent");
        }
        
        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(FriendRequest.Status.PENDING);
        
        friendRequestRepository.save(request);
    }
    
    @Transactional
    public void acceptFriendRequest(Long requestId, Long userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        request.setStatus(FriendRequest.Status.ACCEPTED);
        friendRequestRepository.save(request);
        
        User sender = request.getSender();
        User receiver = request.getReceiver();
        
        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);
        
        userRepository.save(sender);
        userRepository.save(receiver);
    }
    
    @Transactional
    public void declineFriendRequest(Long requestId, Long userId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        request.setStatus(FriendRequest.Status.DECLINED);
        friendRequestRepository.save(request);
    }
    
    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        User friend = userRepository.findById(friendId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        user.getFriends().remove(friend);
        friend.getFriends().remove(user);
        
        userRepository.save(user);
        userRepository.save(friend);
        
        FriendRequest request = friendRequestRepository
            .findBySenderAndReceiver(user, friend).orElse(null);
        
        if (request == null) {
            request = friendRequestRepository
                .findBySenderAndReceiver(friend, user).orElse(null);
        }
        
        if (request != null) {
            friendRequestRepository.delete(request);
        }
    }
    
    public List<FriendRequest> getPendingRequests(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return friendRequestRepository.findByReceiverAndStatus(user, FriendRequest.Status.PENDING);
    }
}
