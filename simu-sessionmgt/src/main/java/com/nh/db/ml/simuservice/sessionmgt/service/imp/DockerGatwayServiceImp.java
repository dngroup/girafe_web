/**
 * 
 */
package com.nh.db.ml.simuservice.sessionmgt.service.imp;

import java.net.URI;
import java.net.URISyntaxException;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nh.db.ml.simuservice.sessionmgt.service.DockerGatwayService;

/**
 * @author dbourasseau
 *
 */
@Service
public class DockerGatwayServiceImp implements DockerGatwayService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DockerGatwayServiceImp.class);

	@Inject
	Client client;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.jbq.db.mddash.sessionmgt.service.DockerGatwayService#setBitrate(java
	 * .lang.String, java.lang.Integer)
	 */
	@Override
	public void setBitrate(String idDocker, Integer bitrate) {
		URI uri;
		try {
			uri = new URI("http://dockermgt:9001/api/" + idDocker + "/"
					+ bitrate);
			WebTarget target = client.target(uri);
			LOGGER.debug("Get MPD {}", target.getUri());
			Response response = target.request().get();
			if (response.getStatus() == Status.ACCEPTED.getStatusCode()) {
				LOGGER.debug(response.getStatusInfo().toString());
			} else {
				LOGGER.error(response.getStatusInfo().toString());
			}
		} catch (URISyntaxException e) {
			LOGGER.error("URI of {} not correct", idDocker, e);
		}

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.jbq.db.mddash.sessionmgt.service.DockerGatwayService#setDefaultBitrate
	 * ()
	 */
	@Override
	public void setDefaultBitrate() {
		// TODO Auto-generated method stub

	}

}
