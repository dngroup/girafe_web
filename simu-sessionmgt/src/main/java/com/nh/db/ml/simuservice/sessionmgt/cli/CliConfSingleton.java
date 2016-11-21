package com.nh.db.ml.simuservice.sessionmgt.cli;

import java.io.File;

public class CliConfSingleton {
	public static String mpdHDPremium = null;
	public static String mpdHD = null;
	public static String mpdSD = null;
	public static String simudocker;
	public static String folder;

	public static String docker_daemon;
	public static String videoFolder;

	public static void defaultValue() {
		if (simudocker == null)
			simudocker = "localhost:9001";
		if (folder == null)
			folder = "/home/dbourasseau/datatemu/";
		if (mpdHDPremium == null) {
			mpdHDPremium = "http://localhost:9003/cdnhd.mpd";
		}
		if (mpdHD == null) {
			mpdHD = "http://localhost:9002/cdn.mpd";
		}
		if (mpdSD == null) {
			mpdSD = "http://localhost:9003/cdnld.mpd";
		}

		if (docker_daemon == null)
			docker_daemon = "localhost:2375";
		if (videoFolder == null) {
			videoFolder = new File(System.getProperty("user.dir"), "../gentelella/input").toString();
		}
	}

}
