package com.jbq.db.mddash.dockermgt.endpoints;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mpeg.dash.schema.mpd._2011.MPD;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.model.Bind;
import com.github.dockerjava.api.model.Capability;
import com.github.dockerjava.api.model.Container;
import com.github.dockerjava.api.model.Container.Port;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.Ports;
import com.github.dockerjava.api.model.Volume;
import com.github.dockerjava.core.DockerClientBuilder;


@Component
@Path("unsecure")
public class TestEndpoints {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(TestEndpoints.class);

//	@GET
//	@Path("world")
//	@Produces({ MediaType.TEXT_PLAIN })
//	public String index() {
//		DockerClient dockerClient = DockerClientBuilder.getInstance(
//				"http://localhost:2375").build();
//		Volume volume1 = new Volume("/usr/local/apache2/htdocs/");
//
//		// List<Image> images = dockerClient.listImagesCmd().exec();
//		// for (Image image : images) {
//		// String[] e = image.getRepoTags();
//		// for (String string : e) {
//		// LOGGER.debug(string);
//		// }
//		//
//		// }
//
//		List<Container> containers = dockerClient.listContainersCmd()
//				.withShowAll(true).exec();
//		for (Container container : containers) {
//			Port[] ports = container.getPorts();
//			for (Port port : ports) {
//				if (port.getPublicPort() == 9002) {
//					dockerClient.killContainerCmd(container.getId()).exec();
//					dockerClient.removeContainerCmd(container.getId()).exec();
//					break;
//				}
//			}
//			LOGGER.debug(container.getNames()[0]);
//			if (container.getNames()[0].contains("apache1")) {
//				dockerClient.removeContainerCmd(container.getId()).exec();
//			}
//		}
//
//		LOGGER.debug("number of container {}", containers.size());
//
//		ExposedPort tcp80 = ExposedPort.tcp(80);
//		Ports portBindings = new Ports();
//		portBindings.bind(tcp80, Ports.Binding(9002));
//
//		Capability capAdd = Capability.NET_ADMIN;
//		CreateContainerResponse container = dockerClient
//				.createContainerCmd("dbourasseau/serverapache")
//				.withPortBindings(portBindings)
//				.withVolumes(volume1)
//				.withBinds(
//						new Bind(
//								"/home/dbourasseau/projet/DemoMDDash/docker/data",
//								volume1)).withCmd("true").withCapAdd(capAdd)
//				.withName("apache1").exec();
//
//		dockerClient.startContainerCmd(container.getId()).exec();
//		ExecCreateCmdResponse execCreateCmdResponse = dockerClient
//				.execCreateCmd(container.getId())
//				.withAttachStdout(true)
//				.withCmd("tc", "qdisc", "change", "dev", "eth0", "root", "tbf",
//						"rate", "800kbit", "burst", "64kbit", "latency", "1ms")
//				.exec();
//		dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec();
//
//		return containers.toString();
//	}
//
//	@GET
//	public String message() {
//		// SecurityContext context =SecurityContextHolder.getContext();
//		// String user = context
//		// .getAuthentication().getName();
//		return "Hello";
//	}
//
//	@POST
//	@Path("world2")
//	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
//	public String message3(MPD mpDtype) {
//
//		return "mpDtype";
//	}
//
//	@RequestMapping(value = "/spring-health", produces = "application/json")
//	public String springMvc() {
//		return new String("Spring MVC: Up and Running!");
//	}

}
