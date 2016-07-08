package com.jbq.db.mddash.dockermgt;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.nh.db.ml.simuservice.dockermgt.SimuApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SimuApplication.class)
@WebAppConfiguration
public class MddashApplicationTests {

	@Test
	public void contextLoads() {
		try {
			URI uri = new URI("/api/register/" +"123");
			String string = uri.toString();
//			URL url= uri.toURL();
//			string = url.toString();
		} catch (URISyntaxException  e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
