package com.nurtura.platform.modules.core.child.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import com.nurtura.platform.modules.core.organization.domain.Organization;
import com.nurtura.platform.modules.core.room.domain.Room;
import com.nurtura.platform.modules.core.site.domain.Site;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "child_profile")
public class Child extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "organization_id", nullable = false)
	private Organization organization;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "site_id", nullable = false)
	private Site site;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id")
	private Room room;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "preferred_name", length = 100)
	private String preferredName;

	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private ChildStatus status;

	@Column(name = "notes", length = 1000)
	private String notes;

	protected Child() {
	}

	public Child(
			Organization organization,
			Site site,
			Room room,
			String firstName,
			String lastName,
			String preferredName,
			LocalDate dateOfBirth,
			ChildStatus status,
			String notes
	) {
		this.organization = organization;
		this.site = site;
		this.room = room;
		this.firstName = firstName;
		this.lastName = lastName;
		this.preferredName = preferredName;
		this.dateOfBirth = dateOfBirth;
		this.status = status;
		this.notes = notes;
	}

	public void updateProfile(
			Organization organization,
			Site site,
			Room room,
			String firstName,
			String lastName,
			String preferredName,
			LocalDate dateOfBirth,
			ChildStatus status,
			String notes
	) {
		this.organization = organization;
		this.site = site;
		this.room = room;
		this.firstName = firstName;
		this.lastName = lastName;
		this.preferredName = preferredName;
		this.dateOfBirth = dateOfBirth;
		this.status = status;
		this.notes = notes;
	}

	public UUID getId() {
		return id;
	}

	public Organization getOrganization() {
		return organization;
	}

	public Site getSite() {
		return site;
	}

	public Room getRoom() {
		return room;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getPreferredName() {
		return preferredName;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public ChildStatus getStatus() {
		return status;
	}

	public String getNotes() {
		return notes;
	}
}
