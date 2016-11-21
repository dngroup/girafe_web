package com.nh.db.ml.simuservice.sessionmgt.service.imp;

import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Volume;
import com.github.dockerjava.core.command.ExecStartResultCallback;
import com.github.dockerjava.core.command.WaitContainerResultCallback;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.model.Topo;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.sessionmgt.exception.NoZeroStatusCode;
import com.nh.db.ml.simuservice.sessionmgt.service.DockerService;

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
	public void createSvgFromTopo(Topo topo) throws NoZeroStatusCode, InterruptedException {

		List<String> list = new ArrayList<String>();
		// Topo Part
		initTopo(topo.getTopo(), list);
		// SLA Part
		list.add("--disable-embedding");
		list.add("--start");
		list.add("0");

		list.add("--cdn");
		list.add("0");
		LogContainerCallback logCall = new LogContainerCallback();
		Integer statusCode = startStop(topo.getSessionId(), topo.getTopo(), list, logCall);
		if (statusCode != 0) {
			LOGGER.error(logCall.toString());
			throw new NoZeroStatusCode();

		}
	}

	@Override
	public void createSvgFromSla(SlaInfo slaInfo) throws NoZeroStatusCode, InterruptedException {
		// Default Part
		List<String> list = new ArrayList<String>();
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
		Integer statusCode;
		LogContainerCallback logCall = new LogContainerCallback();
		statusCode = startStop(slaInfo.getSessionId(), slaInfo.getTopo(), list, logCall);
		if (statusCode != 0) {
			LOGGER.error(logCall.toString());
			throw new NoZeroStatusCode();

		}

	}

	@Override
	public void findBestSLA(SlaInfo slaInfo) throws InterruptedException, NoZeroStatusCode {
		List<String> list = new ArrayList<String>();
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
		LogContainerCallback logCall = new LogContainerCallback();
		Integer statusCode = startStop(slaInfo.getSessionId(), slaInfo.getTopo(), list, logCall);
		if (statusCode != 0) {
			LOGGER.error(logCall.toString());
			throw new NoZeroStatusCode();

		}
	}

	/**
	 * Start and stop docker
	 * 
	 * @param slaInfo
	 * @param list
	 * @throws InterruptedException
	 */
	private Integer startStop(String sessionId, String topo, List<String> list, LogContainerCallback logCall)
			throws InterruptedException {
//		String lala = "{\"links\":[{\"bw\":8000000000,\"delay\":2.6,\"source\":\"01\",\"target\":\"02\"}],\"nodes\":[{\"cpu\":200,\"id\":\"01\"},{\"cpu\":200,\"id\":\"02\"}]}";
//		String lala64 = Base64.encodeAsString(lala.getBytes());
//		list.add(lala64);
		CreateContainerCmd containerinfo = dockerClient.createContainerCmd("nherbaut/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + sessionId, volume))
				.withCmd(list.toArray(new String[list.size()]));
		if (topo.startsWith("file,") && !topo.contains("Geant2012.graphml")) {
			String[] topos = topo.split(",");
			Volume volume2 = new Volume("/opt/simuservice/offline/data/" + topos[1]);
			java.nio.file.Path path = Paths.get(CliConfSingleton.folder, sessionId, topos[1]);
			containerinfo.withBinds(new Bind(CliConfSingleton.folder + sessionId, volume),new Bind(path.toString(), volume2));
		}
		CreateContainerResponse container = containerinfo.exec();

		dockerClient.startContainerCmd(container.getId()).exec();

		Integer statusCode = dockerClient.waitContainerCmd(container.getId()).exec(new WaitContainerResultCallback())
				.awaitStatusCode();

		/** get log of docker **/

		dockerClient.logContainerCmd(container.getId()).withStdErr(true).withStdOut(true).exec(logCall);
		logCall.awaitCompletion();
		// TODO: if the next line is comment uncomment it
		dockerClient.removeContainerCmd(container.getId()).exec();
		return statusCode;
	}

	private void initTopo(String topo, List<String> list) {
		list.add("--plot");
		list.add("--topo");
		list.add(topo);
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
