/**
 * 
 */
package com.jbq.db.mddash.service.imp;



import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;

import org.springframework.stereotype.Service;

import com.jbq.db.mddash.model.AdaptationSetType;
import com.jbq.db.mddash.model.DescriptionType;
import com.jbq.db.mddash.model.MPD;
import com.jbq.db.mddash.model.PeriodType;
import com.jbq.db.mddash.model.PresentationType;
import com.jbq.db.mddash.model.ProgramInformationType;
import com.jbq.db.mddash.model.RepresentationType;
import com.jbq.db.mddash.model.SegmentTemplateType;
import com.jbq.db.mddash.model.URLType;
import com.jbq.db.mddash.service.MPDGenerator;

/**
 * @author dbourasseau
 *
 */
@Service
public class MPDGeneratorImp implements MPDGenerator {

	@Override
	public MPD createTestMPD() {
		MPD mpd = new MPD();

		DatatypeFactory dataType;
		try {
			dataType = DatatypeFactory.newInstance();
			mpd.setMinBufferTime(dataType.newDuration("PT1.500S"));
			mpd.setType(PresentationType.STATIC);
			mpd.setMediaPresentationDuration(dataType.newDuration("PT0H4M42.600S"));
			mpd.setMaxSegmentDuration(dataType.newDuration("PT0H0M4.480S"));
			mpd.setProfiles("urn:mpeg:dash:profile:isoff-live:2011");
			
			ProgramInformationType programInformationType = new ProgramInformationType();
			programInformationType.setMoreInformationURL("http://mddash.homeb.tv:8080/");
			programInformationType.setTitle("MD-DASH");
			
			PeriodType periodType= new PeriodType();
			periodType.setDuration(dataType.newDuration("PT0H4M10.600S"));
			
			AdaptationSetType adaptationSetType = new AdaptationSetType();
			adaptationSetType.setSegmentAlignment("true");
			adaptationSetType.setBitstreamSwitching(true);
			adaptationSetType.setMaxWidth(1280L);
			adaptationSetType.setMaxHeight(720L);
			adaptationSetType.setMaxFrameRate("25");
			adaptationSetType.setPar("16:9");
			adaptationSetType.setLang("und");
			adaptationSetType.setType("MDC");          //////////
			
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
			
			/////////////////////////////////////////////////////////////////
			DescriptionType descriptionType= new DescriptionType();
			descriptionType.setId("1");
			descriptionType.setMDtype("frame");
			descriptionType.setChangeFrameRate(15);
			descriptionType.setDesLevel(1);
			descriptionType.setDesNum(1);
			descriptionType.setDesNumPerLevel(3);
			
			SegmentTemplateType segmentTemplateType = new SegmentTemplateType();
			segmentTemplateType.setTimescale(1200000L);
			segmentTemplateType.setMedia("http://server2.homeb.tv:8080/MDCDN/descriptionCDNd1-5000-100-100_dash$Number$.m4s");
			segmentTemplateType.setStartNumber(1L);
			segmentTemplateType.setDuration(5376000L);
			
			URLType urlType = new URLType();
			urlType.setSourceURL("http://server2.homeb.tv:8080/MDCDN/mdcdn_init.mp4");
			
			segmentTemplateType.setInitialization(urlType);
			
			descriptionType.setSegmentTemplate(segmentTemplateType);
			
			representationType.getDescription().add(descriptionType);
			/////////////////////////////////////////////////////////////////

			/////////////////////////////////////////////////////////////////
			DescriptionType descriptionType2= new DescriptionType();
			descriptionType2.setId("1");
			descriptionType2.setMDtype("frame");
			descriptionType2.setChangeFrameRate(15);
			descriptionType2.setDesLevel(1);
			descriptionType2.setDesNum(2);
			descriptionType2.setDesNumPerLevel(3);
			
			SegmentTemplateType segmentTemplateType2 = new SegmentTemplateType();
			segmentTemplateType2.setTimescale(1200000L);
			segmentTemplateType2.setMedia("http://server3.homeb.tv:8080/MDCDN/descriptionCDNd2-100-5000-100_dash$Number$.m4s");
			segmentTemplateType2.setStartNumber(1L);
			segmentTemplateType2.setDuration(5376000L);
			
			URLType urlType2 = new URLType();
			urlType2.setSourceURL("http://server3.homeb.tv:8080/MDCDN/mdcdn_init.mp4");
			
			segmentTemplateType2.setInitialization(urlType2);
			
			descriptionType2.setSegmentTemplate(segmentTemplateType2);
			
			representationType.getDescription().add(descriptionType2);
			/////////////////////////////////////////////////////////////////

			/////////////////////////////////////////////////////////////////
			DescriptionType descriptionType3= new DescriptionType();
			descriptionType3.setId("1");
			descriptionType3.setMDtype("frame");
			descriptionType3.setChangeFrameRate(15);
			descriptionType3.setDesLevel(1);
			descriptionType3.setDesNum(3);
			descriptionType3.setDesNumPerLevel(3);
			
			SegmentTemplateType segmentTemplateType3 = new SegmentTemplateType();
			segmentTemplateType3.setTimescale(1200000L);
			segmentTemplateType3.setMedia("http://server4.homeb.tv:8080/MDCDN/descriptionCDNd3-100-100-5000_dash$Number$.m4s");
			segmentTemplateType3.setStartNumber(1L);
			segmentTemplateType3.setDuration(5376000L);
			
			URLType urlType3 = new URLType();
			urlType3.setSourceURL("http://server4.homeb.tv:8080/MDCDN/mdcdn_init.mp4");
			
			segmentTemplateType3.setInitialization(urlType3);
			
			descriptionType3.setSegmentTemplate(segmentTemplateType3);
			
			representationType.getDescription().add(descriptionType3);
			/////////////////////////////////////////////////////////////////
			
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

}
