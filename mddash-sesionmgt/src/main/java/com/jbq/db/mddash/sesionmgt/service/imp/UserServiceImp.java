package com.jbq.db.mddash.sesionmgt.service.imp;

import java.util.ArrayList;
import java.util.Iterator;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.jbq.db.mddash.sesionmgt.model.User;
import com.jbq.db.mddash.sesionmgt.repository.UserRepository;
import com.jbq.db.mddash.sesionmgt.service.UserService;

//@Service(value = "userService")
@Service
public class UserServiceImp implements UserService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(UserServiceImp.class);
	@Resource
	private UserRepository userRepository;

	@Override
	public Iterator<User> getAllUsers() {
		return this.userRepository.findAll().iterator();
	}

	@Override
	public User getUserById(Long id) {
		return this.userRepository.findOne(id);
	}

	@Override
	public User createUser(String userName) {
		// Verify if OK to create user
		ArrayList<User> users = Lists.newArrayList( getAllUsers());
		int numbersUser =0;
		for (User user : users) {
			if (user.getStatus()==1);
			numbersUser++;
			
		}
		LOGGER.info("numbers user contected : {} of {}",numbersUser, users.size() );
		//if ok
		User user = new User();
		user.setName(userName);
		user.setStatus(1);
		return createUser(user);
	}

	@Override
	public User createUser(User user) {
		return this.userRepository.save(user);
	}

	@Override
	public User updateUser(User user) {
		return this.userRepository.save(user);
	}

	@Override
	public void deleteUser(Long id) {
		this.userRepository.delete(id);
	}

//	@Override
//	public User getUserByShortName(String shortName) {
//		return this.userRepository.findByShortName(shortName);
//	}

	public UserRepository getUserRepository() {
		return userRepository;
	}

	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public User getUserByName(String userName) {
		return this.userRepository.findByName(userName);
	}
}