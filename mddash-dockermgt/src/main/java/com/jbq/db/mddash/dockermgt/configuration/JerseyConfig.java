package com.jbq.db.mddash.dockermgt.configuration;

import javax.ws.rs.ApplicationPath;


//
//import org.glassfish.jersey.jettison.JettisonFeature;
//import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;
import org.glassfish.jersey.server.wadl.internal.WadlResource;
import org.springframework.stereotype.Component;

import com.jbq.db.mddash.dockermgt.endpoints.RegisterEndpoints;
import com.jbq.db.mddash.dockermgt.endpoints.TestEndpoints;

//import com.jbq.db.mddash.endpoints.UserController;

@Component
@ApplicationPath(value = "/api")
public class JerseyConfig extends ResourceConfig {
	public JerseyConfig() {
	
		registerEndpoints();
	}

	private void registerEndpoints() {
		register(TestEndpoints.class);
		register(RegisterEndpoints.class);
		register(WadlResource.class);
		
		register(RequestContextFilter.class);
//		register(MultiPartFeature.class);
//		register(JettisonFeature.class);
		register(AccessDeniedMapper.class);
	}
}