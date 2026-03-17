package com.nurtura.platform.modules.core.childguardian.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import com.nurtura.platform.modules.core.child.domain.Child;
import com.nurtura.platform.modules.core.guardian.domain.Guardian;
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
		name = "child_guardian_link",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_child_guardian_link", columnNames = {"child_id", "guardian_id"})
		}
)
public class ChildGuardianLink extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "child_id", nullable = false)
	private Child child;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "guardian_id", nullable = false)
	private Guardian guardian;

	@Column(name = "relationship_to_child", nullable = false, length = 80)
	private String relationshipToChild;

	@Column(name = "is_primary_contact", nullable = false)
	private boolean primaryContact;

	@Column(name = "is_emergency_contact", nullable = false)
	private boolean emergencyContact;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private ChildGuardianLinkStatus status;

	protected ChildGuardianLink() {
	}

	public ChildGuardianLink(
			Child child,
			Guardian guardian,
			String relationshipToChild,
			boolean primaryContact,
			boolean emergencyContact,
			ChildGuardianLinkStatus status
	) {
		this.child = child;
		this.guardian = guardian;
		this.relationshipToChild = relationshipToChild;
		this.primaryContact = primaryContact;
		this.emergencyContact = emergencyContact;
		this.status = status;
	}

	public void updateLink(
			String relationshipToChild,
			boolean primaryContact,
			boolean emergencyContact,
			ChildGuardianLinkStatus status
	) {
		this.relationshipToChild = relationshipToChild;
		this.primaryContact = primaryContact;
		this.emergencyContact = emergencyContact;
		this.status = status;
	}

	public void setPrimaryContact(boolean primaryContact) {
		this.primaryContact = primaryContact;
	}

	public UUID getId() {
		return id;
	}

	public Child getChild() {
		return child;
	}

	public Guardian getGuardian() {
		return guardian;
	}

	public String getRelationshipToChild() {
		return relationshipToChild;
	}

	public boolean isPrimaryContact() {
		return primaryContact;
	}

	public boolean isEmergencyContact() {
		return emergencyContact;
	}

	public ChildGuardianLinkStatus getStatus() {
		return status;
	}
}
