package com.jbq.db.mddash.sesionmgt.repository;

import org.springframework.data.repository.CrudRepository;

import com.jbq.db.mddash.sesionmgt.model.User;

public interface UserRepository extends CrudRepository<User, Long> {

	User findByName(String name);

}
