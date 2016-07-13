package com.nh.db.ml.simuservice.dockermgt.endpoints;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.github.dockerjava.api.model.Container;
import com.nh.db.ml.simuservice.dockermgt.service.DockerService;
import com.nh.db.ml.simuservice.model.Grid;
import com.nh.db.ml.simuservice.model.NbUsers;
import com.nh.db.ml.simuservice.model.SlaInfo;

@Component
@Path("/")
public class DockerCTLEndpoints {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DockerCTLEndpoints.class);
	
	@Inject
	DockerService dockerService;

	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("docker/grid")
	public Response createGridSvg(Grid grid) {
		LOGGER.debug(grid.getSessionId());
        dockerService.createSvgFromGrid(grid);
		return Response.accepted().build();
	}
	
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("docker/default")
	public Response createDefault(String SessionID) {
        dockerService.createSvgDefault(SessionID);
		return Response.accepted().build();
	}
	
	
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("docker/sla")
	public Response createGridSvg(SlaInfo slaInfo) {
        dockerService.createSvgFromSla(slaInfo);
		return Response.accepted().build();
	}
	
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("docker/LCsla")
	public Response findBestSLA(SlaInfo slaInfo) {
        dockerService.findBestSLA(slaInfo);
		return Response.accepted().build();
	}
	
	
	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("docker/users")
	public Response setBitrate(NbUsers nbUsers) {
		dockerService.setBitrate(nbUsers);
		return Response.accepted().build();
	}
	
    ///////////////////////////////////////////////////////////////////////////////////
	//
	// From Mddash, throughput control example
	//
	///////////////////////////////////////////////////////////////////////////////////
	@GET
	public String message() {
		 List<Container> containers = dockerService.getstatus();
		 String response = "";
		 for (Container container : containers) {
			 response= response +" "+  container.getNames()[0];
		}
		return response;
	}

	@POST
	@Path("{idDocker}/{bitrate}")	
	public Response setBitrate(@PathParam("idDocker") String idDocker,@PathParam("bitrate") Integer bitrate ) {
        dockerService.setBitrate(idDocker,bitrate);
		return Response.accepted().build();
	}
	
	@GET
	@Path("{idDocker}/{bitrate}")	
	public Response setBitrate2(@PathParam("idDocker") String idDocker,@PathParam("bitrate") Integer bitrate ) {
        dockerService.setBitrate(idDocker,bitrate);
		return Response.accepted().build();
	}
	
	@GET
	@Path("default")
	public Response setDefaultBitrate(){
		dockerService.setDefaultBitrate();
		return Response.accepted().build();
	}




}
