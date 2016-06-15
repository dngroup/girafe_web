package com.jbq.db.mddash.sessionmgt.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.jbq.db.mddash.sessionmgt.model.User;
import com.jbq.db.mddash.sessionmgt.service.UserService;


@Component
public class CustomUserDetailsService implements UserDetailsService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(CustomUserDetailsService.class);
	@Autowired
	public UserService userService;
	

	@Override
	public UserDetails loadUserByUsername(String userName)
			throws UsernameNotFoundException {
		LOGGER.debug("loadUserByUsername {}",userName);
		User user;
		try {
			user = userService.getUserById(Long.valueOf(userName));
		} catch (NumberFormatException e) {
			user = userService.createUser(userName);
		}
		
		SecurityUser securityUser = new SecurityUser(user);
		return securityUser;

	}
}