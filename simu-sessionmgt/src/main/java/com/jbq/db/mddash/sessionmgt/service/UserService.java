package com.jbq.db.mddash.sessionmgt.service;

import java.util.Iterator;

import com.jbq.db.mddash.sessionmgt.model.User;

public interface UserService {
	Iterator<User> getAllUsers();

	User getUserById(Long id);

	User createUser(User user);

	User updateUser(User user);

	void deleteUser(Long id);

	User getUserByName(String userName);

	User createUser(String userName);

//	User getUserByName(String shortName);
}