package com.nurtura.platform.modules.core.site.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import com.nurtura.platform.modules.core.organization.domain.Organization;
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
		name = "site",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_site_organization_code", columnNames = {"organization_id", "code"})
		}
)
public class Site extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "organization_id", nullable = false)
	private Organization organization;

	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@Column(name = "name", nullable = false, length = 150)
	private String name;

	@Column(name = "timezone", nullable = false, length = 60)
	private String timezone;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private SiteStatus status;

	protected Site() {
	}

	public Site(Organization organization, String code, String name, String timezone, SiteStatus status) {
		this.organization = organization;
		this.code = code;
		this.name = name;
		this.timezone = timezone;
		this.status = status;
	}

	public UUID getId() {
		return id;
	}

	public Organization getOrganization() {
		return organization;
	}

	public String getCode() {
		return code;
	}

	public String getName() {
		return name;
	}

	public String getTimezone() {
		return timezone;
	}

	public SiteStatus getStatus() {
		return status;
	}
}
