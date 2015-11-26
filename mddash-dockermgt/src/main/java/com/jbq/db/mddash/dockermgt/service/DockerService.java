package com.jbq.db.mddash.dockermgt.service;

import java.util.List;

import com.github.dockerjava.api.model.Container;

public interface DockerService {

	/**
	 * set bitrate for a docker
	 * @param idDocker
	 * @param bitrate
	 */
	public void setBitrate(String idDocker, Integer bitrate);

	public List<Container> getstatus();

}
