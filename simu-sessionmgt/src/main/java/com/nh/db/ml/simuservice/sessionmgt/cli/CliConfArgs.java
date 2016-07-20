package com.nh.db.ml.simuservice.sessionmgt.cli;

import com.lexicalscope.jewel.cli.CliFactory;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;

public class CliConfArgs {

	public static void getParametersFromArgs(String[] args) {
		
			CliConfig cliconf = CliFactory.parseArguments(CliConfig.class, args);

			CliConfSingleton.simudocker = cliconf.getSimuDocker();
			CliConfSingleton.folder = cliconf.getFolder();
			CliConfSingleton.mpdHDPremium = cliconf.mpdHDPremium();
			CliConfSingleton.mpdHD = cliconf.getMpdHD();
			CliConfSingleton.mpdSD = cliconf.getMpdSD();
			CliConfSingleton.defaultValue();
	}
	
}
