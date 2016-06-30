package com.nh.db.ml.simuservice.sessionmgt.endpoints;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.stereotype.Component;

import com.nh.db.ml.simuservice.model.SlaInfo;

@Component
@Path("simu")
public class SimuEndpoints {

	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sla")
	public Response getserver2(SlaInfo uriS) {
		
		return Response.noContent().build();
	}
}
