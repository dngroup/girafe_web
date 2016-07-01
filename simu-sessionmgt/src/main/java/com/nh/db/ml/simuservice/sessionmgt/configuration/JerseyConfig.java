package com.nh.db.ml.simuservice.sessionmgt.configuration;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;





//
//import org.glassfish.jersey.jettison.JettisonFeature;
//import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;
import org.glassfish.jersey.server.wadl.internal.WadlResource;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.nh.db.ml.simuservice.sessionmgt.endpoints.DockerCTLGatway;
import com.nh.db.ml.simuservice.sessionmgt.endpoints.SimuEndpoints;

//import com.jbq.db.mddash.endpoints.UserController;

@Component
@ApplicationPath(value = "/api")
public class JerseyConfig extends ResourceConfig {
	public JerseyConfig() {
	
		registerEndpoints();
	}

	private void registerEndpoints() {
		register(DockerCTLGatway.class);
		register(SimuEndpoints.class);
		register(WadlResource.class);
		
		register(RequestContextFilter.class);
		register(AccessDeniedMapper.class);
	}
	
	@Bean
	public Client client() {
		
		Client client = ClientBuilder.newClient();
		return client;
		
	}
}