package com.nh.db.ml.simuservice.sessionmgt.cli;

import com.lexicalscope.jewel.cli.Option;

public interface CliConfig {

	@Option(shortName = "d", longName = "simudocker", defaultToNull = true)
	String getSimuDocker();

	@Option(shortName = "f", longName = "folder", defaultToNull = true)
	String getFolder();

	@Option(longName = "HDP", defaultToNull = true)
	String mpdHDPremium();

	@Option(longName = "HD", defaultToNull = true)
	String getMpdHD();

	@Option(longName = "SD", defaultToNull = true)
	String getMpdSD();
	
	@Option(shortName="d", longName = "docker-daemon", defaultToNull=true)
	String getDockerDaemonAddr();
	

	@Option(shortName="v", longName = "videofolder", defaultToNull=true)
	String getVideoFolder();
}
