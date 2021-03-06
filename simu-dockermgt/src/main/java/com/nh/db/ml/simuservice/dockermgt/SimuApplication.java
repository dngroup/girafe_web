package com.nh.db.ml.simuservice.dockermgt;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.nh.db.ml.simuservice.dockergmgt.cli.CliConfArgs;



@SpringBootApplication
//@ComponentScan(basePackages = { 
//		"com.jbq.db.mddash.filter",
//		"com.jbq.db.mddash.db",
//		"com.jbq.db.mddash.configuration",
//		"com.jbq.db.mddash.service",
//		"com.jbq.db.mddash.endpoints",
//		"com.jbq.db.mddash.security",
//		"com.jbq.db.mddash"})
public class SimuApplication{
	private static final Logger LOGGER = LoggerFactory
			.getLogger(SimuApplication.class);


	public static void main(String[] args) {
		
		CliConfArgs.getParametersFromArgs(args);
		
		ApplicationContext ctx = SpringApplication.run(SimuApplication.class,
				args);
		LOGGER.debug("Let's inspect the beans provided by Spring Boot:");
		String[] beanNames = ctx.getBeanDefinitionNames();
		Arrays.sort(beanNames);
		for (String beanName : beanNames) {
			LOGGER.debug(beanName);
		}
	}
}
