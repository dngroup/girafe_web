package com.nh.db.ml.simuservice.sessionmgt.service;

import java.util.List;

import com.github.dockerjava.api.model.Container;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.model.Topo;
import com.nh.db.ml.simuservice.sessionmgt.exception.NoZeroStatusCode;

public interface DockerService {

	/**
	 * set bitrate for a docker
	 * 
	 * @param idDocker
	 * @param bitrate
	 */
	public abstract void setBitrate(String idDocker, Integer bitrate);

	/**
	 * set default bitrate(2500kbps) for all docker server
	 * 
	 * @param idDocker
	 * @param bitrate
	 */
	public abstract void setDefaultBitrate();

	/**
	 * Get Bitrate of docker
	 * @param idDocker
	 */
	public abstract void getBitrate(String idDocker);

	/**
	 * get status of dockers
	 * 
	 * @param idDocker
	 * @param bitrate
	 */
	public abstract List<Container> getstatus();

	public abstract void createSvgFromSla(SlaInfo slaInfo) throws NoZeroStatusCode, InterruptedException;


	/**
	 * Create a streamer video with a tc
	 * @param bitrate
	 * @return
	 */
	public String createVideoServer(Integer bitrate);
	
	/**
	 * Create a streamer video
	 * @param bitrate
	 * @return
	 */
	public String createVideoServer();

	public abstract void setBitrate(NbUsers nbUsers);

	public abstract void findBestSLA(SlaInfo slaInfo) throws InterruptedException, NoZeroStatusCode;

	public abstract void createSvgFromTopo(Topo grid) throws NoZeroStatusCode, InterruptedException;

}