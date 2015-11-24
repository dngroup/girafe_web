package com.jbq.db.mddash.dockermgt.endpoints;

import java.net.URI;
import java.net.URISyntaxException;

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
import org.springframework.web.bind.annotation.RestController;

import com.jbq.db.mddash.dockermgt.model.User;
import com.jbq.db.mddash.dockermgt.service.UserService;

@RestController
@Component
@Path("/register")
public class RegisterEndpoints {

	@Inject
	protected UserService userService;
	
	@POST
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Response register(User user) throws URISyntaxException {
		/*
		 * test if resource are ok
		 */
		
		/*
		 * resource ok
		 */
		user = userService.createUser(user);
		
		return Response.created(new URI("/api/register/" +user.getId())).build() ;
	}

	@GET
	@Path("/{id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public User getUser(@PathParam("id") String id) {
		User user = new User();
		user.setName(id);
		return user;
	}

}
