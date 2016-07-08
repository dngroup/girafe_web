package com.nh.db.ml.simuservice.sessionmgt.cli;

public class CliConfSingleton {
	public static String simudocker;
	public static String folder;
	
	public static void defaultValue() {
		if(simudocker==null)
			simudocker = "localhost:9001";
		if(folder==null)
			folder = "/home/dbourasseau/datatemu/";
	}	
	
}
