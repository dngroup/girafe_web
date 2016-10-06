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

				// StringWriter writer = new StringWriter();
				// try {
				// IOUtils.copy(inputStream, writer, "UTF-8");
				// String theString = writer.toString();
				// LOGGER.debug(theString);
				// } catch (IOException e) {
				// // TODO Auto-generated catch block
				// e.printStackTrace();
				// }

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
	public void createSvgFromGrid(Grid grid) {
		Volume volume = new Volume("/opt/simuservice/offline/results/");
		CreateContainerResponse container = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume)).withCmd("python", "-m",
						"offline.tools.dstep", "--grid", grid.getX() + "x" + grid.getY(), "--just-topo")
				.exec();
		CreateContainerResponse container2 = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd("python", "-m", "offline.tools.plotting", "--svg", "--net").exec();
		CreateContainerResponse container3 = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd("chmod", "737", "/opt/simuservice/offline/results/res.svg").exec();

		dockerClient.startContainerCmd(container.getId()).exec();
		dockerClient.waitContainerCmd(container.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(container2.getId()).exec();
		dockerClient.waitContainerCmd(container2.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(container3.getId()).exec();
		dockerClient.waitContainerCmd(container3.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.removeContainerCmd(container.getId()).exec();
		dockerClient.removeContainerCmd(container2.getId()).exec();
		dockerClient.removeContainerCmd(container3.getId()).exec();
	}

	@Override
	public void createSvgFromTopo(Grid grid) {

		List<String> list = new ArrayList<String>();
		list.add("python");
		list.add("-m");
		list.add("offline.tools.dstep");
		list.add("--topo");
		String[] args = grid.getTopo().split(" ");
		for (String arg : args) {
			list.add(arg);
		}

		list.add("--just-topo");

		Volume volume = new Volume("/opt/simuservice/offline/results/");
		CreateContainerResponse topoGen = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd(list.toArray(new String[list.size()])).exec();
		CreateContainerResponse svgGen = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd("python", "-m", "offline.tools.plotting", "--svg", "--net").exec();
		CreateContainerResponse chmod = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd("chmod", "737", "/opt/simuservice/offline/results/res.svg").exec();

		dockerClient.startContainerCmd(topoGen.getId()).exec();
		dockerClient.waitContainerCmd(topoGen.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(svgGen.getId()).exec();
		dockerClient.waitContainerCmd(svgGen.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(chmod.getId()).exec();
		dockerClient.waitContainerCmd(chmod.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.removeContainerCmd(topoGen.getId()).exec();
		dockerClient.removeContainerCmd(svgGen.getId()).exec();
		dockerClient.removeContainerCmd(chmod.getId()).exec();
	}

	@Override
	public void createSvgDefault(String sessionID) {
		Volume volume = new Volume("/opt/simuservice/offline/results/");
		CreateContainerResponse topoGen = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + sessionID, volume))
				.withCmd("python", "-m", "offline.tools.dstep", "--just-topo").exec();
		CreateContainerResponse svgGen = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + sessionID, volume))
				.withCmd("python", "-m", "offline.tools.plotting", "--svg", "--net").exec();
		CreateContainerResponse chmod = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + sessionID, volume))
				.withCmd("chmod", "737", "/opt/simuservice/offline/results/res.svg").exec();

		dockerClient.startContainerCmd(topoGen.getId()).exec();
		dockerClient.waitContainerCmd(topoGen.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(svgGen.getId()).exec();
		dockerClient.waitContainerCmd(svgGen.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(chmod.getId()).exec();
		dockerClient.waitContainerCmd(chmod.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.removeContainerCmd(topoGen.getId()).exec();
		dockerClient.removeContainerCmd(svgGen.getId()).exec();
		dockerClient.removeContainerCmd(chmod.getId()).exec();
	}

	@Override
	public void createSvgFromSla(SlaInfo slaInfo) {
		Volume volume = new Volume("/opt/simuservice/offline/results/");
		List<String> list = new ArrayList<String>();
		list.add("python");
		list.add("-m");
		list.add("offline.tools.dstep");

		list.add("--topo");
		list.add(slaInfo.getTopo());

		list.add("--vhg");
		list.add((slaInfo.getVmg()));
		list.add("--vcdn");
		list.add((slaInfo.getVcdn()));
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

		CreateContainerResponse topoSolver = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd(list.toArray(new String[list.size()])).exec();
		CreateContainerResponse svgGen = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd("python", "-m", "offline.tools.plotting", "--svg").exec();
		CreateContainerResponse chmod = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd("chmod", "737", "-R", "/opt/simuservice/offline/results/").exec();

		dockerClient.startContainerCmd(topoSolver.getId()).exec();
		dockerClient.waitContainerCmd(topoSolver.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();

		dockerClient.startContainerCmd(svgGen.getId()).exec();
		dockerClient.waitContainerCmd(svgGen.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(chmod.getId()).exec();
		dockerClient.waitContainerCmd(chmod.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.removeContainerCmd(topoSolver.getId()).exec();
		dockerClient.removeContainerCmd(svgGen.getId()).exec();
		dockerClient.removeContainerCmd(chmod.getId()).exec();
	}

	@Override
	public void findBestSLA(SlaInfo slaInfo) {
		Volume volume = new Volume("/opt/simuservice/offline/results/");
		List<String> list = new ArrayList<String>();
		list.add("python");
		list.add("-m");
		list.add("offline.tools.ostep");
		// if (slaInfo.getTopo() != null) {
		list.add("--topo");
		list.add(slaInfo.getTopo());
		// }
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

		CreateContainerResponse bestSolutionSolver = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd(list.toArray(new String[list.size()])).exec();
		CreateContainerResponse container3 = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd("chmod", "737", "-R", "/opt/simuservice/offline/results/").exec();

		dockerClient.startContainerCmd(bestSolutionSolver.getId()).exec();
		dockerClient.waitContainerCmd(bestSolutionSolver.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.startContainerCmd(container3.getId()).exec();
		dockerClient.waitContainerCmd(container3.getId()).exec(new WaitContainerResultCallback()).awaitStatusCode();
		dockerClient.removeContainerCmd(bestSolutionSolver.getId()).exec();
		dockerClient.removeContainerCmd(container3.getId()).exec();
	}

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

	// @Override
	// public String createVideoServer() {
	// createRegistery();
	// ExposedPort tcp80 = ExposedPort.tcp(80);
	// Ports portBindings = new Ports();
	// portBindings.bind(tcp80, Ports.Binding(null));
	//
	// Volume volume = new Volume("/usr/share/nginx/html");
	// Bind bind = new Bind(CliConfSingleton.videoFolder, volume);
	// CreateContainerResponse container =
	// dockerClient.createContainerCmd("ngnix:1.10").withBinds(bind)
	// .withExposedPorts(tcp80).withPortBindings(portBindings).withPublishAllPorts(true).exec();
	// dockerClient.startContainerCmd(container.getId()).exec();
	//
	// return container.getId();
	// }
	//
	// public void createRegistery() {
	//
	// SearchImagesCmd searchImagesCmd =
	// dockerClient.searchImagesCmd("nginx-proxy");
	// ExposedPort tcp80 = ExposedPort.tcp(80);
	// Ports portBindings = new Ports();
	// portBindings.bind(tcp80, Ports.Binding(80));
	// Volume volume = new Volume("/tmp/docker.sock");
	// Bind bind = new Bind("/var/run/docker.sock", volume);
	// CreateContainerResponse container =
	// dockerClient.createContainerCmd("jwilder/nginx-proxy")
	// .withName("nginx-proxy").withBinds(bind).exec();
	//
	// dockerClient.startContainerCmd(container.getId()).exec();
	// }

}
