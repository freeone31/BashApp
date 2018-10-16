package com.dz.bashapp;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ForeignKey;

@Entity(name="dz_quote")
public class dz_quote {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;

	@Column(name="text")
	private String text;

	@Column(name="datetime")
	private Date datetime;

	@Column(name="userid")
	@JoinColumn(foreignKey = @ForeignKey(name = "dz_quote_userid"))
	private Integer userid;

	private dz_quote() {}

	public dz_quote(String iText, Date iDateTime, Integer iUserid) {
		this.text = iText;
		this.datetime = iDateTime;
		this.userid = iUserid;
	}

	public Integer getid() {
		return id;
	}

	public void setid(Integer id) {
		this.id = id;
	}

	public String gettext() {
		return text;
	}

	public void settext(String iText) {
		this.text = iText;
	}

	public Date getdatetime() {
		return datetime;
	}

	public void setdatetime(Date iDateTime) {
		this.datetime = iDateTime;
	}

	public Integer getuserid() {
		return userid;
	}

	public void setuserid(Integer iUserid) {
		this.userid = iUserid;
	}
}