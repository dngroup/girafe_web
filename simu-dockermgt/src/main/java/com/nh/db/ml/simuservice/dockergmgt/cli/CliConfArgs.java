package com.nh.db.ml.simuservice.dockergmgt.cli;

import com.lexicalscope.jewel.cli.CliFactory;

public class CliConfArgs {

	public static void getParametersFromArgs(String[] args) {
		
			CliConfig cliconf = CliFactory.parseArguments(CliConfig.class, args);

			CliConfSingleton.docker_daemon = cliconf.getDockerDaemonAddr();
			CliConfSingleton.folder = cliconf.getFolder();
			CliConfSingleton.defaultValue();
	}
	
}
