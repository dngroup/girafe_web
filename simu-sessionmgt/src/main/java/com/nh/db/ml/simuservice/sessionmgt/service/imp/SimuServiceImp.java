package com.nh.db.ml.simuservice.sessionmgt.service.imp;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Date;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.model.Topo;
//import com.nh.db.ml.simuservice.model.Topo.Json;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.sessionmgt.exception.NoZeroStatusCode;
import com.nh.db.ml.simuservice.sessionmgt.model.SessionSimu;
import com.nh.db.ml.simuservice.sessionmgt.repository.SessionSimuRepository;
import com.nh.db.ml.simuservice.sessionmgt.service.DockerService;
import com.nh.db.ml.simuservice.sessionmgt.service.SimuService;

@Service
public class SimuServiceImp implements SimuService {
	private static final Logger LOGGER = LoggerFactory.getLogger(SimuServiceImp.class);
//	@Inject
//	SessionSimuRepository sessionSimuRepository;

	// @Inject
	// Client client;

	@Inject
	DockerService dockerService;

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
	public Topo createTopo(Topo topo) throws SimulationFailedException {

//		SessionSimu session;
//		if (Strings.isNullOrEmpty(grid.getSessionId())) {
//			session = new SessionSimu(UUID.randomUUID().toString());
//			grid.setSessionId(session.getSessionId());
//		} else {
//			session = sessionSimuRepository.findOneBySessionId(grid.getSessionId());
//			if ((sessionSimuRepository.findOneBySessionId(grid.getSessionId())) == null) {
//				session = new SessionSimu(grid.getSessionId());
//			}
//		}
//		File subdir = new File(CliConfSingleton.folder + grid.getSessionId());
//		subdir.mkdir();
//
//		if (grid.getTopo().equals("jsonfile")) {
//			Json json = grid.getJson();
//
//			File file = new File(CliConfSingleton.folder + grid.getSessionId() + "/topo.json");
//			ObjectMapper mapper = new ObjectMapper();
//			// Object to JSON in file
//			try {
//				mapper.writeValue(file, json);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			grid.setJson(new Json());
//			grid.setTopo("jsonfile,topo.json");
//		}
//
//		SessionAndSvg sessionAndSvg = new SessionAndSvg();
//		sessionAndSvg.setSessionId(grid.getSessionId());
//		sessionAndSvg.setLinkSvg("");
//		try {
//			session.setJsonGrid(new ObjectMapper().writeValueAsString(grid));
//		} catch (JsonProcessingException e) {
//			e.printStackTrace();
//		}

//		SessionSimu sessionToDelet;
//		if ((sessionToDelet = sessionSimuRepository.findOneBySessionId(grid.getSessionId())) != null) {
//			sessionSimuRepository.delete(sessionToDelet);
//		}
//		sessionSimuRepository.save(session);

		// WebTarget target = client.target("http://" +
		// CliConfSingleton.simudocker + "/api/docker/topo");
		// LOGGER.debug(target.getUri().toString());
		// Response response = target.request().post(Entity.entity(grid,
		// MediaType.APPLICATION_XML));
		
		try {
			dockerService.createSvgFromTopo(topo);
		} catch (NoZeroStatusCode e) {
			throw new SimulationFailedException();
		} catch (InterruptedException e) {
			throw new WebApplicationException(e);
		}
		
		
		
		
		return topo;
	}

	@Override
	public SlaInfo computeTopoFromSla(SlaInfo slaInfo) throws SimulationFailedException {
//		SessionSimu session = sessionSimuRepository.findOneBySessionId(slaInfo.getSessionId());
//		if (session != null) {
//			Topo grid = null;
//			if (session.getJsonGrid() != null) {
//				try {
//					grid = new ObjectMapper().readValue(session.getJsonGrid(), Topo.class);
//				} catch (IOException e) {
//					e.printStackTrace();
//				}
//
//				slaInfo.setTopo(grid.getTopo());
//			}

			try {
				String serviceraw = dockerService.createSvgFromSla(slaInfo);
			} catch (NoZeroStatusCode e) {
				throw new SimulationFailedException();
			} catch (InterruptedException e) {
				throw new WebApplicationException(e);
			}
			return slaInfo;

			// WebTarget target = client.target("http://" +
			// CliConfSingleton.simudocker + "/api/docker/sla");
			// Response response = target.request().post(Entity.entity(slaInfo,
			// MediaType.APPLICATION_XML));
			// if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
			// throw new WebApplicationException("docker return error",
			// response.getStatus());
			// }
			
//		}

//		try {
//			return getPrice(slaInfo);
//		} catch (IOException fnfe) {
//			throw new SimulationFailedException();
//		}

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
//		final SessionSimu session = sessionSimuRepository.findOneBySessionId(slaInfo.getSessionId());
//		if (session != null) {
//			Topo grid = null;
//			if (session.getJsonGrid() != null) {
//				try {
//					grid = new ObjectMapper().readValue(session.getJsonGrid(), Topo.class);
//				} catch (final IOException e) {
//					e.printStackTrace();
//				}
//
//				slaInfo.setTopo(grid.getTopo());
//			}
			try {
				String serviceraw = dockerService.findBestSLA(slaInfo);
			} catch (NoZeroStatusCode e) {
				throw new SimulationFailedException();
			} catch (InterruptedException e) {
				throw new WebApplicationException(e);
			}
			return slaInfo;

			// final WebTarget target = client.target("http://" +
			// CliConfSingleton.simudocker + "/api/docker/LCsla");
			// final Response response =
			// target.request().post(Entity.entity(slaInfo,
			// MediaType.APPLICATION_XML));
			// if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
			// throw new WebApplicationException("docker return error",
			// response.getStatus());
			// }
//		}

//		try {
//
//			final File file = new File(CliConfSingleton.folder + slaInfo.getSessionId() + "/price.data");
//			final FileReader fr = new FileReader(file);
//			final char[] a = new char[99999];
//			fr.read(a);
//			final String[] ligne = String.valueOf(a).split("\n");
//			slaInfo.setCosts(Double.valueOf(ligne[0]));
//			slaInfo.setVcdn(ligne[1].split(",")[1]);
//			slaInfo.setVmg(ligne[1].split(",")[0]);
//			fr.close();
//			return slaInfo;
//
//		} catch (final IOException fnfe) {
//
//			throw new SimulationFailedException();
//		} finally {
//
//		}
	}

	@Override
	public void addUserForSession(NbUsers nbUsers) {
//		SessionSimu session = sessionSimuRepository.findOneBySessionId(nbUsers.getSessionId());
//		if (session != null) {
			dockerService.setBitrate(nbUsers);
			// WebTarget target = client.target("http://" +
			// CliConfSingleton.simudocker + "/api/docker/users");
			// Response response = target.request().post(Entity.entity(nbUsers,
			// MediaType.APPLICATION_XML));
//		}
	}
//
//	@Override
//	public File getSvg(SessionAndSvg svgInfo) {
//		File file = new File(CliConfSingleton.folder + svgInfo.getSessionId() + "/topo.svg");
//
//		return file;
//	}

	@Override
	public byte[] getCsv(String sessionId) {
		String test = "UNIX,Valeur0101-0102,Valeur0101-0103,Valeur0102-0103,Valeur0201-0203\n"
				+ Long.toString(new Date().getTime() - 1000) + ",1,2,3,10\n" + new Date().getTime() + ",4,5,6,9";
		byte[] b = test.getBytes(StandardCharsets.UTF_8);

		return b;
	}

//	@Override
//	public Topo sendTopoToDocker(InputStream uploadedInputStream, FormDataContentDisposition fileDetail,
//			MediaType mediaType) {
//		Topo topo = new Topo();
////		topo.setSessionId(UUID.randomUUID().toString());
//		topo.setTopo(fileDetail.getFileName());
//
//		// FormDataMultiPart multiPart = new FormDataMultiPart()
//		// // .field("file", uploadedInputStream,
//		// // MediaType.MULTIPART_FORM_DATA_TYPE)
//		// .field("filename", fileDetail.getFileName()).field("sessionId",
//		// topo.getSessionId());
//		//
//		// FormDataBodyPart body = new FormDataBodyPart("file",
//		// uploadedInputStream, mediaType);
//		// // body.set(fileDetail.getFileName());
//		// multiPart.bodyPart(body);
//
//		// add file here /opt/simuservice/offline/data on docker
//
//		try {
//			java.nio.file.Path path = Paths.get(CliConfSingleton.folder, topo.getSessionId(), fileDetail.getFileName());
//			Paths.get(CliConfSingleton.folder, topo.getSessionId()).toFile().mkdirs();
//			OutputStream out = new FileOutputStream(path.toFile());
//			int read = 0;
//			byte[] bytes = new byte[1024];
//
//			while ((read = uploadedInputStream.read(bytes)) != -1) {
//				out.write(bytes, 0, read);
//			}
//			out.flush();
//			out.close();
//		} catch (FileNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		// final WebTarget target = client.target("http://" +
//		// CliConfSingleton.simudocker + "/api/topo");
//		// final Response response =
//		// target.request().post(Entity.entity(multiPart,
//		// MediaType.MULTIPART_FORM_DATA));
//		// if (response.getStatus() != Status.ACCEPTED.getStatusCode()) {
//		// throw new WebApplicationException("docker return error",
//		// response.getStatus());
//		// }
//
//		return topo;
//	}

}
