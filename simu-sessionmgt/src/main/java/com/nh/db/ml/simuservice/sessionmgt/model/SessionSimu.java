package com.nh.db.ml.simuservice.sessionmgt.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "")
@XmlRootElement(name = "SlaPerSession")
@Entity
public class SessionSimu {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
   
	private String sessionId;
	
	private String jsonGrid;
	
	private String jsonSla;
	
	private int nbUsers;

	private Date created;
	
	private Date updated;
	

	public SessionSimu() {

	}

	public SessionSimu(String sessionId) {
		this.setSessionId(sessionId);
	}

	@PrePersist
	protected void onCreate() {
		setCreated(new Date());
	}

	@PreUpdate
	protected void onUpdate() {
		setUpdated(new Date());
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getUpdated() {
		return updated;
	}

	public void setUpdated(Date updated) {
		this.updated = updated;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getJsonGrid() {
		return jsonGrid;
	}

	public void setJsonGrid(String jsonGrid) {
		this.jsonGrid = jsonGrid;
	}

	public String getJsonSla() {
		return jsonSla;
	}

	public void setJsonSla(String jsonSla) {
		this.jsonSla = jsonSla;
	}

	public int getNbUsers() {
		return nbUsers;
	}

	public void setNbUsers(int nbUsers) {
		this.nbUsers = nbUsers;
	}
}
