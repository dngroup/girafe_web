package com.jbq.db.mddash.dockermgt.endpoints;

import java.io.IOException;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jbq.db.mddash.dockermgt.model.User;
import com.jbq.db.mddash.dockermgt.service.MPDGenerator;
import com.jbq.db.mddash.model.MPD;


@Component
@Path("unsecure")
public class TestEndpoints {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(TestEndpoints.class);
	@Inject
	MPDGenerator mpdGenerator;
	
	@GET
	@Path("world")
	@Produces({ MediaType.APPLICATION_XML})
	public User index() throws JAXBException, IOException {
//		JAXBContext jaxbContext = JAXBContext.newInstance(MPD.class);
//		SchemaOutputResolver sor = new SchemaOutputResolver() {
//			
//			@Override
//			public Result createOutput(String namespaceUri, String suggestedFileName) throws MalformedURLException{
//			 File file = new File(suggestedFileName);
//	        StreamResult result = new StreamResult(file);
//	        result.setSystemId(file.toURI().toURL().toString());
//	        return result;
//			}
//		};
//		jaxbContext.generateSchema(sor);
		return new User();
	}

	@GET
	public String message() {
//		SecurityContext context =SecurityContextHolder.getContext();
//		String user = context
//		.getAuthentication().getName();
		return "Hello";
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_XML})
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
	
//	@GET
//	@Secured("ROLE_USER")
//	public String secure() {
//		return "Hello Security";
//	}
//	@GET
//	@PreAuthorize("true")
//	public String authorized() {
//		return "Hello World";
//	}
//	@GET
//	@PreAuthorize("false")
//	public String denied() {
//		return "Goodbye World";
//	}
//	
	
    @RequestMapping(value = "/spring-health", produces = "application/json")
    public String springMvc() {
        return new String("Spring MVC: Up and Running!");
    }

}
