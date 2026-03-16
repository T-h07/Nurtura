package com.nurtura.platform.modules.identity.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import com.nurtura.platform.security.ApplicationRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_role")
public class Role extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "code", nullable = false, unique = true, length = 50)
	private ApplicationRole code;

	@Column(name = "display_name", nullable = false, length = 100)
	private String displayName;

	protected Role() {
	}

	public Role(ApplicationRole code, String displayName) {
		this.code = code;
		this.displayName = displayName;
	}

	public Long getId() {
		return id;
	}

	public ApplicationRole getCode() {
		return code;
	}

	public String getDisplayName() {
		return displayName;
	}
}
