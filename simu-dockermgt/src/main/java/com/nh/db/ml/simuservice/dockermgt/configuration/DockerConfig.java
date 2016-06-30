package com.nh.db.ml.simuservice.dockermgt.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DockerClientBuilder;


@Component
public class DockerConfig{
	
	@Bean
	public DockerClient dockerClient(){
		return DockerClientBuilder.getInstance(
				"http://172.17.42.1:2375/").build();
		
	}

}