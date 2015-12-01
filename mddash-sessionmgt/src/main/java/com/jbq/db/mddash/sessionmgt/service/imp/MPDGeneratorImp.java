/**
 * 
 */
package com.jbq.db.mddash.sessionmgt.service.imp;

import java.io.StringReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

import mpeg.dash.schema.mpd._2011.AdaptationSetType;
import mpeg.dash.schema.mpd._2011.DescriptionType;
import mpeg.dash.schema.mpd._2011.MPD;
import mpeg.dash.schema.mpd._2011.PeriodType;
import mpeg.dash.schema.mpd._2011.PresentationType;
import mpeg.dash.schema.mpd._2011.ProgramInformationType;
import mpeg.dash.schema.mpd._2011.RepresentationType;
import mpeg.dash.schema.mpd._2011.SegmentTemplateType;
import mpeg.dash.schema.mpd._2011.URLType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.google.common.base.Strings;
import com.google.common.collect.Sets;
import com.jbq.db.mddash.model.ListString;
import com.jbq.db.mddash.sessionmgt.service.MPDGenerator;

/**
 * @author dbourasseau
 *
 */
@Service
public class MPDGeneratorImp implements MPDGenerator {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(MPDGeneratorImp.class);

	@Inject
	Client client;

	@Override
	public MPD createTestMPD() {
		MPD mpd = new MPD();

		DatatypeFactory dataType;
		try {
			dataType = DatatypeFactory.newInstance();
			mpd.setMinBufferTime(dataType.newDuration("PT1.500S"));
			mpd.setType(PresentationType.STATIC);
			mpd.setMediaPresentationDuration(dataType
					.newDuration("PT0H4M42.600S"));
			mpd.setMaxSegmentDuration(dataType.newDuration("PT0H0M4.480S"));
			mpd.setProfiles("urn:mpeg:dash:profile:isoff-live:2011");

			ProgramInformationType programInformationType = new ProgramInformationType();
			programInformationType
					.setMoreInformationURL("http://mddash.homeb.tv:8080/");
			programInformationType.setTitle("MD-DASH");

			PeriodType periodType = new PeriodType();
			periodType.setDuration(dataType.newDuration("PT0H4M10.600S"));

			AdaptationSetType adaptationSetType = new AdaptationSetType();
			adaptationSetType.setSegmentAlignment("true");
			adaptationSetType.setBitstreamSwitching(true);
			adaptationSetType.setMaxWidth(1280L);
			adaptationSetType.setMaxHeight(720L);
			adaptationSetType.setMaxFrameRate("25");
			adaptationSetType.setPar("16:9");
			adaptationSetType.setLang("und");
			adaptationSetType.setType("MDC"); // ////////

			RepresentationType representationType = new RepresentationType();
			representationType.setId("1");
			representationType.setMimeType("video/mp4");
			representationType.setCodecs("avc3.42c01e");
			representationType.setWidth(1280L);
			representationType.setHeight(720L);
			representationType.setFrameRate("25");
			representationType.setSar("1:1");
			representationType.setStartWithSAP(1L);
			representationType.setBandwidth(1736218L);

			// ///////////////////////////////////////////////////////////////
			DescriptionType descriptionType = new DescriptionType();
			descriptionType.setId("1");
			descriptionType.setMDtype("frame");
			descriptionType.setChangeFrameRate(15);
			descriptionType.setDesLevel(1);
			descriptionType.setDesNum(1);
			descriptionType.setDesNumPerLevel(3);

			SegmentTemplateType segmentTemplateType = new SegmentTemplateType();
			segmentTemplateType.setTimescale(1200000L);
			segmentTemplateType
					.setMedia("http://server2.homeb.tv:8080/MDCDN/descriptionCDNd1-5000-100-100_dash$Number$.m4s");
			segmentTemplateType.setStartNumber(1L);
			segmentTemplateType.setDuration(5376000L);

			URLType urlType = new URLType();
			urlType.setSourceURL("http://server2.homeb.tv:8080/MDCDN/mdcdn_init.mp4");

			segmentTemplateType.setInitialization(urlType);

			descriptionType.setSegmentTemplate(segmentTemplateType);

			representationType.getDescription().add(descriptionType);
			// ///////////////////////////////////////////////////////////////

			// ///////////////////////////////////////////////////////////////
			DescriptionType descriptionType2 = new DescriptionType();
			descriptionType2.setId("1");
			descriptionType2.setMDtype("frame");
			descriptionType2.setChangeFrameRate(15);
			descriptionType2.setDesLevel(1);
			descriptionType2.setDesNum(2);
			descriptionType2.setDesNumPerLevel(3);

			SegmentTemplateType segmentTemplateType2 = new SegmentTemplateType();
			segmentTemplateType2.setTimescale(1200000L);
			segmentTemplateType2
					.setMedia("http://server3.homeb.tv:8080/MDCDN/descriptionCDNd2-100-5000-100_dash$Number$.m4s");
			segmentTemplateType2.setStartNumber(1L);
			segmentTemplateType2.setDuration(5376000L);

			URLType urlType2 = new URLType();
			urlType2.setSourceURL("http://server3.homeb.tv:8080/MDCDN/mdcdn_init.mp4");

			segmentTemplateType2.setInitialization(urlType2);

			descriptionType2.setSegmentTemplate(segmentTemplateType2);

			representationType.getDescription().add(descriptionType2);
			// ///////////////////////////////////////////////////////////////

			// ///////////////////////////////////////////////////////////////
			DescriptionType descriptionType3 = new DescriptionType();
			descriptionType3.setId("1");
			descriptionType3.setMDtype("frame");
			descriptionType3.setChangeFrameRate(15);
			descriptionType3.setDesLevel(1);
			descriptionType3.setDesNum(3);
			descriptionType3.setDesNumPerLevel(3);

			SegmentTemplateType segmentTemplateType3 = new SegmentTemplateType();
			segmentTemplateType3.setTimescale(1200000L);
			segmentTemplateType3
					.setMedia("http://server4.homeb.tv:8080/MDCDN/descriptionCDNd3-100-100-5000_dash$Number$.m4s");
			segmentTemplateType3.setStartNumber(1L);
			segmentTemplateType3.setDuration(5376000L);

			URLType urlType3 = new URLType();
			urlType3.setSourceURL("http://server4.homeb.tv:8080/MDCDN/mdcdn_init.mp4");

			segmentTemplateType3.setInitialization(urlType3);

			descriptionType3.setSegmentTemplate(segmentTemplateType3);

			representationType.getDescription().add(descriptionType3);
			// ///////////////////////////////////////////////////////////////

			adaptationSetType.getRepresentation().add(representationType);

			periodType.getAdaptationSet().add(adaptationSetType);

			mpd.getProgramInformation().add(programInformationType);
			mpd.getPeriod().add(periodType);
		} catch (DatatypeConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return mpd;
	}

	@Override
	public ListString getserverlist(URI uri) {
		ListString servers = new ListString();
		WebTarget target = client.target(uri);
		LOGGER.debug("Get MPD {}", target.getUri());
		try {

			Response response = target.request(MediaType.WILDCARD).get();
			String mpds = response.readEntity(String.class);

			try {
				JAXBContext jaxbContext = JAXBContext.newInstance(MPD.class);
				Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();

				StringReader reader = new StringReader(mpds);
				MPD mpd = (MPD) unmarshaller.unmarshal(reader);

				List<RepresentationType> representationTypes = mpd.getPeriod()
						.get(0).getAdaptationSet().get(0).getRepresentation();
				for (RepresentationType representationType : representationTypes) {
					List<DescriptionType> desTypes;
					try {
						String media = representationType.getSegmentTemplate()
								.getMedia();
						String host = URI.create(media).getHost();
						if (!Strings.isNullOrEmpty(host)) {
							String[] hostSplit = host.split(Pattern.quote("."));
							servers.getStr().add(hostSplit[0]);
						} else {
							String[] hostmpdSplit = uri.getHost().split(
									Pattern.quote("."));
							servers.getStr().add(hostmpdSplit[0]);
						}

					} catch (NullPointerException e) {

//						e.printStackTrace();
					}
					try {
					desTypes = representationType.getDescription();
					for (DescriptionType descriptionType : desTypes) {
					
							String media2 = descriptionType.getSegmentTemplate()
									.getMedia();
							String uri2 = URI.create(media2).getHost();
							String[] aaa2 = uri2.split(Pattern.quote("."));
							servers.getStr().add(aaa2[0]);
						
					}
					} catch (NullPointerException e) {
						
//						e.printStackTrace();
					}
				}

			} catch (JAXBException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (WebApplicationException e) {
			throw e;
		}
		Set<String> set = new HashSet<String>();

		set.addAll(servers.getStr());
		servers.getStr().clear();
		
		for (String string : set) {
			
			servers.getStr().add(string);
		}
		java.util.Collections.sort(servers.getStr());
		return servers;
	}

}
