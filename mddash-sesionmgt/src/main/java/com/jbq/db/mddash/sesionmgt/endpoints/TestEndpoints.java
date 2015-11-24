package com.jbq.db.mddash.sesionmgt.endpoints;


import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBException;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jbq.db.mddash.model.MPD;

@Component
@Path("unsecure")
public class TestEndpoints {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(TestEndpoints.class);

	@GET
	@Path("world")
	@Produces({ MediaType.APPLICATION_XML })
	public String index() throws JAXBException, IOException {

		return "ff()";
	}

	@GET
	public String message() {
		// SecurityContext context =SecurityContextHolder.getContext();
		// String user = context
		// .getAuthentication().getName();
		return "Hello";
	}

	@POST
	@Path("world2")
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String message3(MPD mpDtype) {

		return "mpDtype";
	}


	@RequestMapping(value = "/spring-health", produces = "application/json")
	public String springMvc() {
		return new String("Spring MVC: Up and Running!");
	}

}
