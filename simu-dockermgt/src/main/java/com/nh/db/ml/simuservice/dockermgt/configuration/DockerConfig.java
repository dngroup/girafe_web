package com.nh.db.ml.simuservice.dockermgt.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.core.DockerClientConfig;

@Component
public class DockerConfig {

	@Bean
	public DockerClient dockerClient() {
		DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
				.withDockerHost("tcp://172.17.0.1:2375")
			    .withDockerConfig("/home/dbourasseau/.docker")
			    .withRegistryUrl("https://index.docker.io/v1/")
				.withApiVersion("1.23")
				.build();
		return DockerClientBuilder.getInstance(config).build();

	}

}