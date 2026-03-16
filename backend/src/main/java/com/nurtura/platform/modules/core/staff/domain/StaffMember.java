package com.nurtura.platform.modules.core.staff.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import com.nurtura.platform.modules.core.organization.domain.Organization;
import com.nurtura.platform.modules.core.room.domain.Room;
import com.nurtura.platform.modules.core.site.domain.Site;
import com.nurtura.platform.modules.identity.domain.UserAccount;
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
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(
		name = "staff_member",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_staff_member_organization_staff_code", columnNames = {"organization_id", "staff_code"})
		}
)
public class StaffMember extends AuditableEntity {

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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_account_id", unique = true)
	private UserAccount userAccount;

	@Column(name = "staff_code", nullable = false, length = 50)
	private String staffCode;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "job_title", nullable = false, length = 120)
	private String jobTitle;

	@Enumerated(EnumType.STRING)
	@Column(name = "employment_status", nullable = false, length = 30)
	private EmploymentStatus employmentStatus;

	protected StaffMember() {
	}

	public StaffMember(
			Organization organization,
			Site site,
			Room room,
			UserAccount userAccount,
			String staffCode,
			String firstName,
			String lastName,
			String jobTitle,
			EmploymentStatus employmentStatus
	) {
		this.organization = organization;
		this.site = site;
		this.room = room;
		this.userAccount = userAccount;
		this.staffCode = staffCode;
		this.firstName = firstName;
		this.lastName = lastName;
		this.jobTitle = jobTitle;
		this.employmentStatus = employmentStatus;
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

	public UserAccount getUserAccount() {
		return userAccount;
	}

	public String getStaffCode() {
		return staffCode;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public EmploymentStatus getEmploymentStatus() {
		return employmentStatus;
	}
}
