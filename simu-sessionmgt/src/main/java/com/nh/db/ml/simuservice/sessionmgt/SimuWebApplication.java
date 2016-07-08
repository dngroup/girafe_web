package com.nh.db.ml.simuservice.sessionmgt;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfArgs;




@SpringBootApplication

public class SimuWebApplication{
	private static final Logger LOGGER = LoggerFactory
			.getLogger(SimuWebApplication.class);


	public static void main(String[] args) {
		
		CliConfArgs.getParametersFromArgs(args);
		
		ApplicationContext ctx = SpringApplication.run(SimuWebApplication.class,
				args);
		LOGGER.debug("Let's inspect the beans provided by Spring Boot:");
		String[] beanNames = ctx.getBeanDefinitionNames();
		Arrays.sort(beanNames);
		for (String beanName : beanNames) {
			LOGGER.debug(beanName);
		}
	}
}
