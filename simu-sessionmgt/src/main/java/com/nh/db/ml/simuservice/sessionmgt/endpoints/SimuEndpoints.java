package com.nh.db.ml.simuservice.sessionmgt.endpoints;

import java.io.File;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.stereotype.Component;

import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SessionAndSvg;
import com.nh.db.ml.simuservice.model.SlaInfo;
import com.nh.db.ml.simuservice.sessionmgt.cli.CliConfSingleton;
import com.nh.db.ml.simuservice.sessionmgt.service.SimuService;

@Component
@Path("simu")
public class SimuEndpoints {
	@Inject
	SimuService simuService;
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("grid")
	public Response postGrid(Grid grid) {
		SessionAndSvg sessionAndSvg = simuService.createTopoFromGrid(grid);
		return Response.accepted(sessionAndSvg).build();
	}

	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sla")
	public Response postSla(SlaInfo slaInfo) {
		simuService.computeTopoFromSla(slaInfo);
		return Response.noContent().build();
	}
	
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("users")
	public Response postUsers(NbUsers nbUsers) {
		simuService.addUserForSession(nbUsers);
		return Response.noContent().build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_SVG_XML)
	@Path("svg/{sessionid}")
	public Response getSvg(@PathParam("sessionid") String sessionId) {
		File file = new File(CliConfSingleton.folder + "res.svg");
		return Response.ok(file, MediaType.APPLICATION_SVG_XML).build();
	}
}
