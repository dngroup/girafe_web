package com.nh.db.ml.simuservice.sessionmgt.service;

import java.io.File;

import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.sessionmgt.service.imp.SimulationFailedException;

public interface SimuService {
	
	/**
	 * Create the topology svg on which the user can select the SLA informations
	 * 
	 * @param grid
	 */
	public abstract SessionAndSvg createTopoFromGrid(Grid grid);
	
	/**
	 * Create the topology svg on which the user can select the SLA informations
	 * 
	 * @param grid
	 */
	public abstract SessionAndSvg createTopoDefault();
	
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

	public abstract File getSvg(SessionAndSvg svgInfo);

	/**
	 * get datas for the graph 
	 * 
	 * @param sessionId
	 * @return
	 */
	public abstract byte[] getCsv(String sessionId);

	public abstract SessionAndSvg createTopo(Grid topo);

//	public abstract SlaInfo getCostFonction(SlaInfo slaInfo) throws SimulationFailedException;


}
