package com.nh.db.ml.simuservice.sessionmgt.service.imp;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.sessionmgt.model.SessionSimu;
import com.nh.db.ml.simuservice.sessionmgt.repository.SessionSimuRepository;
import com.nh.db.ml.simuservice.sessionmgt.service.SimuService;

@Service
public class SimuServiceImp implements SimuService {

	@Inject
	SessionSimuRepository sessionSimuRepository;
	
	@Inject
	Client client;
	
	@Override
	public SessionAndSvg createTopoFromGrid(Grid grid) {
		SessionSimu session = new SessionSimu(UUID.randomUUID().toString());
		SessionAndSvg sessionAndSvg= new SessionAndSvg();
		sessionAndSvg.setSessionId(session.getSessionId());
		sessionAndSvg.setLinkSvg("");
		grid.setSessionId(session.getSessionId());
		try {
			session.setJsonGrid(new ObjectMapper().writeValueAsString(grid));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		sessionSimuRepository.save(session);
		WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/grid");
		Response response = target.request().post(Entity.entity(grid, MediaType.APPLICATION_XML));
		return sessionAndSvg;
	}

	@Override
	public void computeTopoFromSla(SlaInfo slaInfo) {
		SessionSimu session = sessionSimuRepository.findOneBySessionId(slaInfo.getSessionId());
		if(session != null){
			Grid grid = null;
			try {
				grid = new ObjectMapper().readValue(session.getJsonGrid(), Grid.class);
			} catch (IOException e) {
				e.printStackTrace();
			}
			slaInfo.setGrid(grid.getX() + "x" + grid.getY());
			WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/sla");
			Response response = target.request().post(Entity.entity(slaInfo, MediaType.APPLICATION_XML));
		}
	}

	@Override
	public void addUserForSession(NbUsers nbUsers) {
		SessionSimu session = sessionSimuRepository.findOneBySessionId(nbUsers.getSessionId());
		if(session != null){
			Grid grid = null;
			SlaInfo slaInfo = null;
			try {
				grid = new ObjectMapper().readValue(session.getJsonGrid(), Grid.class);
				slaInfo = new ObjectMapper().readValue(session.getJsonSla(), SlaInfo.class);
			} catch (IOException e) {
				e.printStackTrace();
			}
			slaInfo.setGrid(grid.getX() + "x" + grid.getY());
			WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/users");
			Response response = target.request().post(Entity.entity(nbUsers, MediaType.APPLICATION_XML));
		}
	}

	@Override
	public File getSvg(SessionAndSvg svgInfo) {
		File file = new File(CliConfSingleton.folder + svgInfo.getSessionId() + "/res.svg");
		
		return file;
	}

	@Override
	public byte[] getCsv(String sessionId) {
		String test = "UNIX,Valeur0101-0102,Valeur0101-0103,Valeur0102-0103,Valeur0201-0203\n" + Long.toString(new Date().getTime()-1000) + ",1,2,3,10\n" + new Date().getTime() + ",4,5,6,9";
		byte[] b = test.getBytes(StandardCharsets.UTF_8);
		
		return b;
	}

}
