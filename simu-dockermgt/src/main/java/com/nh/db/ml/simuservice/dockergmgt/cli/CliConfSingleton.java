package com.nh.db.ml.simuservice.dockergmgt.cli;

import java.io.File;

public class CliConfSingleton {
	public static String docker_daemon;
	public static String folder;
	public static String videoFolder;

	public static void defaultValue() {
		if (docker_daemon == null)
			docker_daemon = "localhost:2375";
		if (folder == null)
			folder = "/home/dbourasseau/datatemu/";
		if (videoFolder == null) {
			videoFolder = new File(System.getProperty("user.dir"), "../gentelella/input").toString();
		}
	}

}
