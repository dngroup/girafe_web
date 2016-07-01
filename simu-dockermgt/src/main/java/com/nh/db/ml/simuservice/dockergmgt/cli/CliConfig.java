package com.nh.db.ml.simuservice.dockergmgt.cli;

import com.lexicalscope.jewel.cli.Option;

public interface CliConfig {
	
	@Option(shortName="d", longName = "docker-daemon", defaultToNull=true)
	String getDockerDaemonAddr();
	
	@Option(shortName="f", longName = "folder", defaultToNull=true)
	String getFolder();

}
