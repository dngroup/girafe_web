package com.jbq.db.mddash.sessionmgt.endpoints;

import java.io.IOException;
import java.net.URI;
import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBException;

import mpeg.dash.schema.mpd._2011.MPD;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jbq.db.mddash.model.ListString;
import com.jbq.db.mddash.sessionmgt.service.MPDGenerator;

@Component
@Path("unsecure/mpd/")
public class MPDEndpoints {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(MPDEndpoints.class);
	@Inject
	MPDGenerator mpdGenerator;

//	@GET
//	@Path("servers")
////	@Produces({ MediaType.APPLICATION_XML})
//	public String getserver(URI uris) throws JAXBException, IOException {
////URI uri = URI.create(uris);
////		mpdGenerator.getserverlist()
//		return "http://localhost:8000/api/unsecure/mpd/server";
//	}

	@POST
	@Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("servers")
	public ListString getserver2(String uriS) throws JAXBException, IOException {
		URI uri = URI.create(uriS);
		ListString servers= mpdGenerator.getserverlist(uri);
		return servers;
	}

	@GET
	public String message() {
		// SecurityContext context =SecurityContextHolder.getContext();
		// String user = context
		// .getAuthentication().getName();
		return "Hello";
	}

	@GET
	@Produces({ MediaType.APPLICATION_XML })
	@Path("world2")
	public MPD message2() {
		MPD mpd = mpdGenerator.createTestMPD();

		return mpd;
	}

	@POST
	@Path("world2")
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public MPD message3(MPD mpDtype) {

		return mpDtype;
	}

	// @GET
	// @Secured("ROLE_USER")
	// public String secure() {
	// return "Hello Security";
	// }
	// @GET
	// @PreAuthorize("true")
	// public String authorized() {
	// return "Hello World";
	// }
	// @GET
	// @PreAuthorize("false")
	// public String denied() {
	// return "Goodbye World";
	// }
	//

	@RequestMapping(value = "/spring-health", produces = "application/json")
	public String springMvc() {
		return new String("Spring MVC: Up and Running!");
	}

}
