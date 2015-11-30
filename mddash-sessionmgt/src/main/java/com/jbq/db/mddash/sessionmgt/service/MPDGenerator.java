package com.jbq.db.mddash.sessionmgt.service;

import java.net.URI;
import java.util.List;

import com.jbq.db.mddash.model.ListString;

import mpeg.dash.schema.mpd._2011.MPD;


public interface MPDGenerator {

	abstract public MPD createTestMPD();

	public abstract ListString getserverlist(URI uri);

}
