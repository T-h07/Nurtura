package com.nurtura.platform.modules.identity.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user_account")
public class UserAccount extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Email
	@Column(name = "email", nullable = false, unique = true, length = 255)
	private String email;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "password_hash", nullable = false, length = 255)
	private String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private UserStatus status;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "user_account_role",
			joinColumns = @JoinColumn(name = "user_account_id"),
			inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private final Set<Role> roles = new LinkedHashSet<>();

	protected UserAccount() {
	}

	public UserAccount(String email, String firstName, String lastName, String passwordHash, UserStatus status) {
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.passwordHash = passwordHash;
		this.status = status;
	}

	public void assignRole(Role role) {
		this.roles.add(role);
	}

	public UUID getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public UserStatus getStatus() {
		return status;
	}

	public Set<Role> getRoles() {
		return Set.copyOf(roles);
	}
}
