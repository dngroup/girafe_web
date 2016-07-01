package com.nh.db.ml.simuservice.sessionmgt.repository;

import org.springframework.data.repository.CrudRepository;

import com.nh.db.ml.simuservice.sessionmgt.model.SessionSimu;

public interface SessionSimuRepository extends CrudRepository<SessionSimu, Long>{
	SessionSimu findOneBySessionId(String sessionId);
}
