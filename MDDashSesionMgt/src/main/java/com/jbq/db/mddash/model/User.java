package com.jbq.db.mddash.model;

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
@XmlRootElement(name = "user")
@Entity
public class User  {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String email;
	
	private String name;
	
	private Date created;
	
	private Date updated;
	
	private Integer status;

//	private List<String> MPDsTesting;

	@PrePersist
	protected void onCreate() {
		created = new Date();
	}

	@PreUpdate
	protected void onUpdate() {
		updated = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the created
	 */
	public Date getCreated() {
		return created;
	}

	/**
	 * @param created the created to set
	 */
	public void setCreated(Date created) {
		this.created = created;
	}

	/**
	 * @return the updated
	 */
	public Date getUpdated() {
		return updated;
	}

	/**
	 * @param updated the updated to set
	 */
	public void setUpdated(Date updated) {
		this.updated = updated;
	}

	/**
	 * @return the status
	 */
	public Integer getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(Integer status) {
		this.status = status;
	}

//	/**
//	 * @return the mPDsTesting
//	 */
//	@ElementCollection
//	@CollectionTable(name="Nicknames", joinColumns=@JoinColumn(name="user_id"))
//	@Column(name="nickname")
//	public List<String> getMPDsTesting() {
//		return MPDsTesting;
//	}
//
//	/**
//	 * @param mPDsTesting the mPDsTesting to set
//	 */
//	@ElementCollection
//	@CollectionTable(name="Nicknames", joinColumns=@JoinColumn(name="user_id"))
//	@Column(name="nickname")
//	public void setMPDsTesting(List<String> mPDsTesting) {
//		MPDsTesting = mPDsTesting;
//	}

	
}
