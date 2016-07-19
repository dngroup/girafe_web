package com.nh.db.ml.simuservice.sessionmgt.endpoints;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;

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

import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;
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
	@Path("grid")
	public Response postGrid(Grid grid) {
		SessionAndSvg sessionAndSvg = simuService.createTopoFromGrid(grid);
		return Response.accepted(sessionAndSvg).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("topo")
	public Response postFromFile(Grid grid) {
		SessionAndSvg sessionAndSvg = simuService.createTopo(grid);
		// SessionAndSvg sessionAndSvg = simuService.createTopoDefault();
		return Response.accepted(sessionAndSvg).build();
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
			return postSla(slaInfo2);
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
		File file = new File(CliConfSingleton.folder + sessionId + "/" + "res.svg");
		
		try {
			FileInputStream fin = new FileInputStream(file);
			return Response.ok(file, MediaType.APPLICATION_SVG_XML).build();
		} catch ( IOException e) {
			return Response.ok(file, MediaType.APPLICATION_SVG_XML).build();
		}
		
		
	}

	@GET
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	@Path("data/{sessionid}")
	public Response getCsv(@PathParam("sessionid") String sessionId) {
		byte[] byteArray = simuService.getCsv(sessionId);
		return Response.ok(byteArray, MediaType.APPLICATION_OCTET_STREAM).build();
	}
}
