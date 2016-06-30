package com.nh.db.ml.simuservice.sessionmgt.service;

import java.net.URI;
import java.util.List;

import com.nh.db.ml.simuservice.model.ListString;

import mpeg.dash.schema.mpd._2011.MPD;


public interface MPDGenerator {

	abstract public MPD createTestMPD();

	public abstract ListString getserverlist(URI uri);

}
