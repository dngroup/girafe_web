package com.nh.db.ml.simuservice.dockermgt.service.imp;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Capability;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Volume;
import com.nh.db.ml.simuservice.dockergmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.dockermgt.service.DockerService;
import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.SlaInfo;

@Service
public class DockerServiceImp implements DockerService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DockerServiceImp.class);
	@Inject
	DockerClient dockerClient;

	/* (non-Javadoc)
	 * @see com.jbq.db.mddash.dockermgt.service.imp.DockerService#setBitrate(java.lang.String, java.lang.Integer)
	 */
	@Override
	public void setBitrate(String idDocker, Integer bitrate) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains(idDocker)) {
//				dockerClient.startContainerCmd(container.getId()).exec();
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient
						.execCreateCmd(container.getId())
						.withAttachStdout(true)
						.withCmd("tc", "qdisc", "change", "dev", "eth0",
								"root", "tbf", "rate", bitrate + "kbit",
								"burst", "64kbit", "latency", "1ms").exec();
				dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec();
			}
		}
	}
	
	/* (non-Javadoc)
	 * @see com.jbq.db.mddash.dockermgt.service.imp.DockerService#setDefaultBitrate()
	 */
	@Override
	public void setDefaultBitrate() {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains("server")) {
//				dockerClient.startContainerCmd(container.getId()).exec();
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient
						.execCreateCmd(container.getId())
						.withAttachStdout(true)
						.withCmd("tc", "qdisc", "change", "dev", "eth0",
								"root", "tbf", "rate", "2500" + "kbit",
								"burst", "64kbit", "latency", "1ms").exec();
				dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec();
			}
		}
	}
	
	
	
	/* (non-Javadoc)
	 * @see com.jbq.db.mddash.dockermgt.service.imp.DockerService#getBitrate(java.lang.String)
	 */
	@Override
	public void getBitrate(String idDocker) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains(idDocker)) {
				ExecCreateCmdResponse execCreateCmdResponse = dockerClient
						.execCreateCmd(container.getId())
						.withAttachStdout(true)
						.withCmd("tc", "qdisc").exec();
				InputStream inputStream = dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec();
				
				StringWriter writer = new StringWriter();
				try {
					IOUtils.copy(inputStream, writer, "UTF-8");
					String theString = writer.toString();
					LOGGER.debug(theString);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		}

	}
	/* (non-Javadoc)
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
		.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
		.withCmd("python",  "-m",  "offline.tools.dstep", "--grid", grid.getX() + "x" + grid.getY(), "-t")
		.exec();
		CreateContainerResponse container2 = dockerClient.createContainerCmd("dngroup/simuservice")
		.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
		.withCmd("python",  "-m",  "offline.tools.plotting", "--svg", "--net")
		.exec();
		CreateContainerResponse container3 = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + grid.getSessionId(), volume))
				.withCmd("chmod", "737", "/opt/simuservice/offline/results/res.svg")
				.exec();
		
		
		dockerClient.startContainerCmd(container.getId()).exec();
		dockerClient.waitContainerCmd(container.getId()).exec();
		dockerClient.startContainerCmd(container2.getId()).exec();
		dockerClient.waitContainerCmd(container2.getId()).exec();
		dockerClient.startContainerCmd(container3.getId()).exec();
		dockerClient.waitContainerCmd(container3.getId()).exec();
		dockerClient.removeContainerCmd(container.getId()).exec();
		dockerClient.removeContainerCmd(container2.getId()).exec();
		dockerClient.removeContainerCmd(container3.getId()).exec();
	}

	@Override
	public void createSvgFromSla(SlaInfo slaInfo) {
		Volume volume = new Volume("/opt/simuservice/offline/results/");
		List<String> list = new ArrayList<String>();
		list.add("python");
		list.add("-m");
		list.add("offline.tools.dstep");
		list.add("--grid");
		list.add(slaInfo.getGrid());
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
		
		CreateContainerResponse container = dockerClient.createContainerCmd("dngroup/simuservice")
		.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
		.withCmd(list.toArray(new String[list.size()]))
		.exec();
		CreateContainerResponse container2 = dockerClient.createContainerCmd("dngroup/simuservice")
		.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
		.withCmd("python",  "-m",  "offline.tools.plotting", "--svg")
		.exec();
		CreateContainerResponse container3 = dockerClient.createContainerCmd("dngroup/simuservice")
				.withBinds(new Bind(CliConfSingleton.folder + slaInfo.getSessionId(), volume))
				.withCmd("chmod", "737", "/opt/simuservice/offline/results/res.svg")
				.exec();
		
		dockerClient.startContainerCmd(container.getId()).exec();
		dockerClient.waitContainerCmd(container.getId()).exec();
		dockerClient.startContainerCmd(container2.getId()).exec();
		dockerClient.waitContainerCmd(container2.getId()).exec();
		dockerClient.startContainerCmd(container3.getId()).exec();
		dockerClient.waitContainerCmd(container3.getId()).exec();
		dockerClient.removeContainerCmd(container.getId()).exec();
		dockerClient.removeContainerCmd(container2.getId()).exec();
		dockerClient.removeContainerCmd(container3.getId()).exec();
	}
}
