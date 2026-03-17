package com.nurtura.platform.modules.core.guardian.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "guardian_contact")
public class Guardian extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "phone_number", nullable = false, length = 40)
	private String phoneNumber;

	@Column(name = "email", nullable = false, length = 255)
	private String email;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private GuardianStatus status;

	protected Guardian() {
	}

	public Guardian(
			String firstName,
			String lastName,
			String phoneNumber,
			String email,
			GuardianStatus status
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.status = status;
	}

	public void updateProfile(
			String firstName,
			String lastName,
			String phoneNumber,
			String email,
			GuardianStatus status
	) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.status = status;
	}

	public UUID getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public GuardianStatus getStatus() {
		return status;
	}
}
