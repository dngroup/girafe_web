package com.jbq.db.mddash.dockermgt.service.imp;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Container;
import com.jbq.db.mddash.dockermgt.service.DockerService;

@Service
public class DockerServiceImp implements DockerService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DockerServiceImp.class);
	@Inject
	DockerClient dockerClient;

	/**
	 * set bitrate for a docker
	 * 
	 * @param idDocker
	 * @param bitrate
	 */
	public void setBitrate(String idDocker, Integer bitrate) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		LOGGER.debug("number of container {}", containers.size());
		for (Container container : containers) {
			if (container.getNames()[0].contains(idDocker)) {
				dockerClient.startContainerCmd(container.getId()).exec();
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

	/**
	 * get status of dockers
	 * 
	 * @param idDocker
	 * @param bitrate
	 */
	public List<Container> getstatus(String idDocker, Integer bitrate) {

		List<Container> containers = dockerClient.listContainersCmd().exec();
		// LOGGER.debug("number of container {}", containers.size());
		// for (Container container : containers) {
		// if (container.getNames()[0].contains(idDocker)) {
		// dockerClient.startContainerCmd(container.getId()).exec();
		// ExecCreateCmdResponse execCreateCmdResponse = dockerClient
		// .execCreateCmd(container.getId())
		// .withAttachStdout(true)
		// .withCmd("tc", "qdisc", "change", "dev", "eth0",
		// "root", "tbf", "rate", bitrate + "kbit",
		// "burst", "64kbit", "latency", "1ms").exec();
		// dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec();
		// }
		// }
		return containers;
	}

}
