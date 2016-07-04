package com.nh.db.ml.simuservice.sessionmgt.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;

import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;

public interface SimuService {
	
	/**
	 * Create the topology svg on which the user can select the SLA informations
	 * 
	 * @param grid
	 */
	public abstract SessionAndSvg createTopoFromGrid(Grid grid);
	
	/**
	 * Compute the topo for the given SLA
	 * 
	 * @param slaInfo
	 */
	public abstract void computeTopoFromSla(SlaInfo slaInfo);

	/**
	 * Change the number of users
	 * 
	 * @param nbUsers
	 */
	public abstract void addUserForSession(NbUsers nbUsers);

	public abstract File getSvg(SessionAndSvg svgInfo);

	/**
	 * get datas for the graph 
	 * 
	 * @param sessionId
	 * @return
	 */
	public abstract byte[] getCsv(String sessionId);


}
