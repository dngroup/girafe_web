package com.nh.db.ml.simuservice.sessionmgt.service.imp;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.CharBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	private static final Logger LOGGER = LoggerFactory.getLogger(SimuServiceImp.class);
	@Inject
	SessionSimuRepository sessionSimuRepository;

	@Inject
	Client client;

	// @Override
	// public SessionAndSvg createTopoFromGrid(Grid grid) {
	// SessionSimu session = new SessionSimu(UUID.randomUUID().toString());
	// SessionAndSvg sessionAndSvg = new SessionAndSvg();
	// sessionAndSvg.setSessionId(session.getSessionId());
	// sessionAndSvg.setLinkSvg("");
	// grid.setSessionId(session.getSessionId());
	// try {
	// session.setJsonGrid(new ObjectMapper().writeValueAsString(grid));
	// } catch (JsonProcessingException e) {
	// e.printStackTrace();
	// }
	// sessionSimuRepository.save(session);
	// WebTarget target = client.target("http://" + CliConfSingleton.simudocker
	// + "/api/docker/grid");
	// LOGGER.debug(target.getUri().toString());
	// Response response = target.request().post(Entity.entity(grid,
	// MediaType.APPLICATION_XML));
	//
	// return sessionAndSvg;
	// }

	@Override
	public SessionAndSvg createTopo(Grid grid) {
		SessionSimu session = new SessionSimu(UUID.randomUUID().toString());
		SessionAndSvg sessionAndSvg = new SessionAndSvg();
		sessionAndSvg.setSessionId(session.getSessionId());
		sessionAndSvg.setLinkSvg("");
		grid.setSessionId(session.getSessionId());
		try {
			session.setJsonGrid(new ObjectMapper().writeValueAsString(grid));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		sessionSimuRepository.save(session);
		WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/topo");
		LOGGER.debug(target.getUri().toString());
		Response response = target.request().post(Entity.entity(grid, MediaType.APPLICATION_XML));
		if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
			throw new WebApplicationException("docker return error", response.getStatus());
		}
		return sessionAndSvg;
	}



	@Override
	public SlaInfo computeTopoFromSla(SlaInfo slaInfo) throws SimulationFailedException {
		SessionSimu session = sessionSimuRepository.findOneBySessionId(slaInfo.getSessionId());
		if (session != null) {
			Grid grid = null;
			if (session.getJsonGrid() != null) {
				try {
					grid = new ObjectMapper().readValue(session.getJsonGrid(), Grid.class);
				} catch (IOException e) {
					e.printStackTrace();
				}

				slaInfo.setTopo(grid.getTopo());
			}
			WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/sla");
			Response response = target.request().post(Entity.entity(slaInfo, MediaType.APPLICATION_XML));
			if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
				throw new WebApplicationException("docker return error", response.getStatus());
			}
		}

		try {
			return getPrice(slaInfo);
		} catch (IOException fnfe) {
			throw new SimulationFailedException();
		}

		// throw new SimulationFailedException();
	}

	/**
	 * @param slaInfo
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	private SlaInfo getPrice(final SlaInfo slaInfo) throws FileNotFoundException, IOException {
		final File file = new File(CliConfSingleton.folder + slaInfo.getSessionId() + "/price.data");
		final FileReader fr = new FileReader(file);
		final char[] a = new char[99999];
		fr.read(a);
		slaInfo.setCosts(Double.valueOf(String.valueOf(a).split("\n")[0]));
		fr.close();
		return slaInfo;
	}

	@Override
	public SlaInfo computeLowCostSla(final SlaInfo slaInfo) throws SimulationFailedException {
		final SessionSimu session = sessionSimuRepository.findOneBySessionId(slaInfo.getSessionId());
		if (session != null) {
			Grid grid = null;
			if (session.getJsonGrid() != null) {
				try {
					grid = new ObjectMapper().readValue(session.getJsonGrid(), Grid.class);
				} catch (final IOException e) {
					e.printStackTrace();
				}

				slaInfo.setTopo(grid.getTopo());
			}
			final WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/LCsla");
			final Response response = target.request().post(Entity.entity(slaInfo, MediaType.APPLICATION_XML));
			if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
				throw new WebApplicationException("docker return error", response.getStatus());
			}
		}

		try {

			final File file = new File(CliConfSingleton.folder + slaInfo.getSessionId() + "/price.data");
			final FileReader fr = new FileReader(file);
			final char[] a = new char[99999];
			fr.read(a);
			final String[] ligne = String.valueOf(a).split("\n");
			slaInfo.setCosts(Double.valueOf(ligne[0]));
			slaInfo.setVcdn(ligne[1].split(",")[1]);
			slaInfo.setVmg(ligne[1].split(",")[0]);
			fr.close();
			return slaInfo;

		} catch (final IOException fnfe) {

			throw new SimulationFailedException();
		} finally {

		}
	}

	@Override
	public void addUserForSession(NbUsers nbUsers) {
		SessionSimu session = sessionSimuRepository.findOneBySessionId(nbUsers.getSessionId());
		if (session != null) {
			WebTarget target = client.target("http://" + CliConfSingleton.simudocker + "/api/docker/users");
			Response response = target.request().post(Entity.entity(nbUsers, MediaType.APPLICATION_XML));
		}
	}

	@Override
	public File getSvg(SessionAndSvg svgInfo) {
		File file = new File(CliConfSingleton.folder + svgInfo.getSessionId() + "/topo.svg");

		return file;
	}

	@Override
	public byte[] getCsv(String sessionId) {
		String test = "UNIX,Valeur0101-0102,Valeur0101-0103,Valeur0102-0103,Valeur0201-0203\n"
				+ Long.toString(new Date().getTime() - 1000) + ",1,2,3,10\n" + new Date().getTime() + ",4,5,6,9";
		byte[] b = test.getBytes(StandardCharsets.UTF_8);

		return b;
	}

}
