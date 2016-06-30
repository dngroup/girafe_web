package com.nh.db.ml.simuservice.dockermgt.service.imp;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Container;
import com.nh.db.ml.simuservice.dockermgt.service.DockerService;

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



}
