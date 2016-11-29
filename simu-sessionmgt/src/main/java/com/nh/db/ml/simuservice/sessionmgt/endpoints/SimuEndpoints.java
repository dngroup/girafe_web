package com.nh.db.ml.simuservice.sessionmgt.endpoints;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.ws.WebServiceException;

import org.springframework.stereotype.Component;

import com.nh.db.ml.simuservice.model.ListString;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.model.Topo;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.sessionmgt.service.SimuService;
import com.nh.db.ml.simuservice.sessionmgt.service.imp.SimulationFailedException;

@Component
@Path("simu")
public class SimuEndpoints {
	@Inject
	SimuService simuService;

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("topo")
	public Response postFromFile(Topo grid) {
		Topo sessionAndSvg;
		try {
			sessionAndSvg = simuService.createTopo(grid);
			// SessionAndSvg sessionAndSvg = simuService.createTopoDefault();
			return Response.accepted(sessionAndSvg).build();
		} catch (SimulationFailedException e) {
			throw new WebServiceException("simulation failed to complete");
		}
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sla")
	public SlaInfo postSla(SlaInfo slaInfo) {

		try {
			return simuService.computeTopoFromSla(slaInfo);
		} catch (SimulationFailedException e) {
			throw new WebServiceException("simulation failed to complete");
		}
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("LCsla")
	public SlaInfo postLowCostSla(SlaInfo slaInfo) {

		try {
			SlaInfo slaInfo2 = simuService.computeLowCostSla(slaInfo);
			return slaInfo2;
		} catch (SimulationFailedException e) {
			throw new WebServiceException("simulation failed to complete");
		}
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("users")
	public Response postUsers(NbUsers nbUsers) {
		simuService.addUserForSession(nbUsers);
		return Response.noContent().build();
	}

	@GET
	@Produces(MediaType.APPLICATION_SVG_XML)
	@Path("svg/{sessionid}")
	public Response getSvg(@PathParam("sessionid") String sessionId) {
		File file = new File(CliConfSingleton.folder + sessionId + "/topo.svg");
		try {
			FileInputStream fin = new FileInputStream(file);
			return Response.ok(file, MediaType.APPLICATION_SVG_XML).build();
		} catch (IOException e) {
			return Response.ok(file, MediaType.APPLICATION_SVG_XML).build();
		}
	}

	@GET
	@Path("dot/{sessionid}")
	public Response getdot(@PathParam("sessionid") String sessionId) {
		File file = new File(CliConfSingleton.folder + sessionId + "/substrate.dot");
		try {
			FileInputStream fin = new FileInputStream(file);
			return Response.ok(file).build();
		} catch (IOException e) {
			return Response.ok(file).build();
		}
	}

	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	@Path("data/{sessionid}")
	public Response getCsv(@PathParam("sessionid") String sessionId) {
		byte[] byteArray = simuService.getCsv(sessionId);
		return Response.ok(byteArray, MediaType.APPLICATION_OCTET_STREAM).build();
	}

	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("mpd")
	public ListString getMpd() {
		ListString l = new ListString();
		l.getStr().add(CliConfSingleton.mpdHDPremium);
		l.getStr().add(CliConfSingleton.mpdHD);
		l.getStr().add(CliConfSingleton.mpdSD);
		return l;
	}

//	@POST
//	@Path("upload")
//	@Consumes(MediaType.MULTIPART_FORM_DATA)
//	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
//	public Response uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
//			@FormDataParam("file") FormDataContentDisposition fileDetail,
//			@FormDataParam("file") FormDataBodyPart body) {
//		// ){
//		MediaType mediaType = body.getMediaType();
//
//		Topo topo = simuService.sendTopoToDocker(uploadedInputStream, fileDetail, mediaType);
//
//		return Response.status(200).entity(topo).build();
//
//	}

}
