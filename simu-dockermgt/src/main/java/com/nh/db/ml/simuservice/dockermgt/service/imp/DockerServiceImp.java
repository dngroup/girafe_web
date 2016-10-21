package com.nh.db.ml.simuservice.dockermgt.service.imp;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Volume;
import com.github.dockerjava.core.command.ExecStartResultCallback;
import com.github.dockerjava.core.command.WaitContainerResultCallback;
import com.nh.db.ml.simuservice.dockergmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.dockermgt.service.DockerService;
import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;

@Service
public class DockerServiceImp implements DockerService {
	private static final Logger LOGGER = LoggerFactory.getLogger(DockerServiceImp.class);
	@Inject
	DockerClient dockerClient;

	Volume volume = new Volume("/opt/girafe/results");

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.jbq.db.mddash.dockermgt.service.imp.DockerService#setBitrate(java.
	 * lang.String, java.lang.Integer)
	 */
	@Override
	public void setBitrate(String idDocker, Integer bitrate) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains(idDocker)) {
				// dockerClient.startContainerCmd(container.getId()).exec();
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient
						.execCreateCmd(container.getId()).withAttachStdout(true).withCmd("tc", "qdisc", "change", "dev",
								"eth0", "root", "tbf", "rate", bitrate + "kbit", "burst", "64kbit", "latency", "1ms")
						.exec();
				// ResultCallback dd;
				dockerClient.execStartCmd(execCreateCmdResponse.getId())
						.exec(new ExecStartResultCallback(System.out, System.err));
				// System.out.println(run);
			}
		}
	}

	@Override
	public void setBitrate(NbUsers nbUsers) {
		setBitrate("server", 170000 / nbUsers.getNbusers());

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.jbq.db.mddash.dockermgt.service.imp.DockerService#setDefaultBitrate()
	 */
	@Override
	public void setDefaultBitrate() {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains("server")) {
				// dockerClient.startContainerCmd(container.getId()).exec();
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient
						.execCreateCmd(container.getId()).withAttachStdout(true).withCmd("tc", "qdisc", "change", "dev",
								"eth0", "root", "tbf", "rate", "2500" + "kbit", "burst", "64kbit", "latency", "1ms")
						.exec();
				dockerClient.execStartCmd(execCreateCmdResponse.getId())
						.exec(new ExecStartResultCallback(System.out, System.err));
			}
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.jbq.db.mddash.dockermgt.service.imp.DockerService#getBitrate(java.
	 * lang.String)
	 */
	@Override
	public void getBitrate(String idDocker) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains(idDocker)) {
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient.execCreateCmd(container.getId())
						.withAttachStdout(true).withCmd("tc", "qdisc").exec();
				OutputStream outputStream = null;
				dockerClient.execStartCmd(execCreateCmdResponse.getId())
						.exec(new ExecStartResultCallback(outputStream, System.err));

			}
		}

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.jbq.db.mddash.dockermgt.service.imp.DockerService#getstatus()
	 */
	@Override
	public List<Container> getstatus() {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		return containers;
	}

	@Override
	public void createSvgFromTopo(Grid grid) {
		List<String> list = init();
		// Topo Part
		initTopo(grid.getTopo(), list);
		// SLA Part
		list.add("--disable-embedding");
		list.add("--start");
		list.add("0");

		list.add("--cdn");
		list.add("0");
		
		startStop(grid.getSessionId(), list);
	}

	@Override
	public void createSvgFromSla(SlaInfo slaInfo) {
		// Default Part

		List<String> list = init();

		// Topo Part
		initTopo(slaInfo.getTopo(), list);

		// SLA Part
		list.add("--sla_delay");
		list.add(Integer.toString(slaInfo.getSladelay()));
		list.add("--sourcebw");
		list.add(Long.toString(slaInfo.getBandwidth()));
		list.add("--vcdnratio");
		list.add(Double.toString(slaInfo.getVcdnratio()));
		list.add("--start");
		list.addAll(slaInfo.getClients());
		list.add("--cdn");
		list.addAll(slaInfo.getCdns());
		list.add("--vhg");
		list.add(slaInfo.getVmg());
		list.add("--vcdn");
		list.add(slaInfo.getVcdn());

		startStop(slaInfo.getSessionId(), list);
	}

	/**
	 * Start and stop docker
	 * 
	 * @param slaInfo
	 * @param list
	 */
	private void startStop(String sessionID, List<String> list) {
		CreateContainerResponse container = dockerClient.createContainerCmd("nherbaut/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + sessionID, volume))
				.withCmd(list.toArray(new String[list.size()])).exec();
		dockerClient.startContainerCmd(container.getId()).exec();
		dockerClient.waitContainerCmd(container.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
//		dockerClient.removeContainerCmd(container.getId()).exec();
	}

	private void initTopo(String topo, List<String> list) {
		list.add("--topo");
		// TODO: change metrics to get from a SLA
		// don't work with all topology like Geant
		list.add(topo + ",10000000000,10,1000");
	}

	private List<String> init() {
		List<String> list = new ArrayList<String>();
//		list.add("--dest_folder");
//		list.add("/tmp/data");
		return list;
	}

	@Override
	public void findBestSLA(SlaInfo slaInfo) {
		List<String> list = init();

		// Topo Part
		initTopo(slaInfo.getTopo(), list);

		// SLA Part
		list.add("--sla_delay");
		list.add(Integer.toString(slaInfo.getSladelay()));
		list.add("--sourcebw");
		list.add(Long.toString(slaInfo.getBandwidth()));
		list.add("--vcdnratio");
		list.add(Double.toString(slaInfo.getVcdnratio()));
		list.add("--start");
		list.addAll(slaInfo.getClients());
		list.add("--cdn");
		list.addAll(slaInfo.getCdns());

		list.add("--auto");

		startStop(slaInfo.getSessionId(), list);
	}

	// @Override
	@Override
	public String createVideoServer(Integer bitrate) {
		String containerId = createVideoServer();
		setBitrate(containerId, bitrate);
		return containerId;
	}

	@Override
	public String createVideoServer() {
		// TODO Auto-generated method stub
		return null;
	}

}
