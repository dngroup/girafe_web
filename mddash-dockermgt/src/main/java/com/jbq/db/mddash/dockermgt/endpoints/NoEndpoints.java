package com.jbq.db.mddash.dockermgt.endpoints;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Component
@ComponentScan
@Controller
@RequestMapping("/foo")
public class NoEndpoints {

	@RequestMapping("/foo")
	private String index() {
		SecurityContext context =SecurityContextHolder.getContext();
		String user = context
		.getAuthentication().getName();
		return user;
	}

	@RequestMapping("/")
	public String message() {
//		SecurityContext context =SecurityContextHolder.getContext();
//		String user = context
//		.getAuthentication().getName();
		return "Hello";
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
