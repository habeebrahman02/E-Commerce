package com.amaterra.service;

import com.amaterra.entity.User;
import com.amaterra.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
 
    public User saveUser(User user) {
        return userRepository.save(user); 
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
}



