package com.nh.db.ml.simuservice.dockergmgt.cli;

public class CliConfSingleton {
	public static String docker_daemon;
	public static String folder;
	
	public static void defaultValue() {
		if(docker_daemon==null)
			docker_daemon = "localhost:2375";
		if(folder==null)
			folder = "/home/mlacaud/datatemu/";
	}	
	
}
