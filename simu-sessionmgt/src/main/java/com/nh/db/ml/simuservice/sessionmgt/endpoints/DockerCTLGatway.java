package com.nh.db.ml.simuservice.sessionmgt.endpoints;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.nh.db.ml.simuservice.sessionmgt.service.DockerGatwayService;
import com.nh.db.ml.simuservice.sessionmgt.service.MPDGenerator;



@Component
@Path("unsecure/docker")
public class DockerCTLGatway {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DockerCTLGatway.class);
	@Inject
	MPDGenerator mpdGenerator;
	
	@Inject
	DockerGatwayService dockerGatwayService;
	

	
	@POST
	@Path("{idDocker}/{bitrate}")	
	public Response setBitrate(@PathParam("idDocker") String idDocker,@PathParam("bitrate") Integer bitrate ) {
		if (bitrate==1800){
			bitrate=2500;
		}
        dockerGatwayService.setBitrate(idDocker,bitrate);
		return Response.accepted().build();
	}
	
	@GET
	@Path("{idDocker}/{bitrate}")	
	public Response setBitrate2(@PathParam("idDocker") String idDocker,@PathParam("bitrate") Integer bitrate ) {
		dockerGatwayService.setBitrate(idDocker,bitrate);
		return Response.accepted().build();
	}

	@GET
	@Path("default")
	public Response setDefaultBitrate(){
		dockerGatwayService.setDefaultBitrate();
		return Response.ok().build();
	}


}
