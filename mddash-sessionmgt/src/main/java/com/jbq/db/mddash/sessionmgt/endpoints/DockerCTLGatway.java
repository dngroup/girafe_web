package com.jbq.db.mddash.sessionmgt.endpoints;

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
import javax.xml.bind.JAXBException;

import mpeg.dash.schema.mpd._2011.MPD;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jbq.db.mddash.sessionmgt.model.User;
import com.jbq.db.mddash.sessionmgt.service.DockerGatwayService;
import com.jbq.db.mddash.sessionmgt.service.MPDGenerator;



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
