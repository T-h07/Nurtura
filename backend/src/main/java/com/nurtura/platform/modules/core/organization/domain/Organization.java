package com.nurtura.platform.modules.core.organization.domain;

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
@Table(name = "organization")
public class Organization extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "code", nullable = false, unique = true, length = 50)
	private String code;

	@Column(name = "legal_name", nullable = false, length = 180)
	private String legalName;

	@Column(name = "display_name", nullable = false, length = 140)
	private String displayName;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private OrganizationStatus status;

	protected Organization() {
	}

	public Organization(String code, String legalName, String displayName, OrganizationStatus status) {
		this.code = code;
		this.legalName = legalName;
		this.displayName = displayName;
		this.status = status;
	}

	public UUID getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public String getLegalName() {
		return legalName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public OrganizationStatus getStatus() {
		return status;
	}
}
