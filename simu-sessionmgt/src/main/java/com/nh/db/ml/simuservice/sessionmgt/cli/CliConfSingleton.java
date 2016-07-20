package com.nh.db.ml.simuservice.sessionmgt.cli;

public class CliConfSingleton {
	public static String mpdHDPremium = null;
	public static String mpdHD = null;
	public static String mpdSD = null;
	public static String simudocker;
	public static String folder;
	
	public static void defaultValue() {
		if(simudocker==null)
			simudocker = "localhost:9001";
		if(folder==null)
			folder = "/home/dbourasseau/datatemu/";
		if(mpdHDPremium==null){
			mpdHDPremium = "http://localhost:9003/cdnhd.mpd";
		}
		if(mpdHD==null){
			mpdHD = "http://localhost:9002/cdn.mpd";
		}
		if(mpdSD==null){
			mpdSD = "http://localhost:9003/cdnld.mpd";
		}
	}	
	
}
