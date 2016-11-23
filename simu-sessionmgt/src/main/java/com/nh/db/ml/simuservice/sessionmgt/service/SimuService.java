package com.nh.db.ml.simuservice.sessionmgt.service;

import java.io.File;
import java.io.InputStream;

import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import com.nh.db.ml.simuservice.model.NbUsers;
//import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.model.Topo;
import com.nh.db.ml.simuservice.sessionmgt.service.imp.SimulationFailedException;

public interface SimuService {
	

//	/**
//	 * Create the topology svg on which the user can select the SLA informations
//	 * 
//	 * @param grid
//	 */
//	public abstract SessionAndSvg createTopoDefault();
	
	/**
	 * Compute the topo for the given SLA
	 * 
	 * @param slaInfo
	 * @return 
	 * @throws SimulationFailedException 
	 */
	public abstract SlaInfo computeTopoFromSla(SlaInfo slaInfo) throws SimulationFailedException;

	/**
	 * give the best cost for a SLA
	 * @param slaInfo
	 * @return
	 * @throws SimulationFailedException 
	 */
	public abstract SlaInfo computeLowCostSla(SlaInfo slaInfo) throws SimulationFailedException;

	/**
	 * Change the number of users
	 * 
	 * @param nbUsers
	 */
	public abstract void addUserForSession(NbUsers nbUsers);

//	public abstract File getSvg(SessionAndSvg svgInfo);

	/**
	 * get datas for the graph 
	 * 
	 * @param sessionId
	 * @return
	 */
	public abstract byte[] getCsv(String sessionId);

	public abstract Topo createTopo(Topo topo) throws SimulationFailedException;

//	/**
//	 * send simu service to the folder
//	 * @param uploadedInputStream
//	 * @param fileDetail
//	 * @param mediaType 
//	 * @return 
//	 */
//	public abstract Topo sendTopoToDocker(InputStream uploadedInputStream, FormDataContentDisposition fileDetail, MediaType mediaType);
//
//	public abstract SlaInfo getCostFonction(SlaInfo slaInfo) throws SimulationFailedException;


}
