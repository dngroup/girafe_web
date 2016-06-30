package com.nh.db.ml.simuservice.dockermgt.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;

//import javax.inject.Inject;


@Configuration
@EnableWebSecurity
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	// @Autowired
	// public void configureGlobal(AuthenticationManagerBuilder auth) throws
	// Exception {
	// auth
	// .inMemoryAuthentication()
	// .withUser("user").password("password").roles("USER");
	// }

	// @Autowired
	// public void configureGlobal(AuthenticationManagerBuilder auth) throws
	// Exception {
	// auth.
	// // .userDetailsService(customUserDetailsService);
	// }

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http
			.authorizeRequests()
				.antMatchers("/**").hasIpAddress("172.17.42.1/16")
				.antMatchers("/**").hasIpAddress("127.0.0.0/24")
				//TODO: comment next line
				.antMatchers("/**").permitAll()
			.and()
				.csrf()
				.disable();
	}

	

	@EnableGlobalMethodSecurity(prePostEnabled = true)
	private static class GlobalSecurityConfiguration extends
			GlobalMethodSecurityConfiguration {
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		DefaultWebSecurityExpressionHandler handler = new DefaultWebSecurityExpressionHandler();
		web.expressionHandler(handler);
	}
}
