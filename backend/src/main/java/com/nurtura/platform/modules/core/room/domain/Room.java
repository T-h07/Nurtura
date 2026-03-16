package com.nurtura.platform.modules.core.room.domain;

import com.nurtura.platform.common.persistence.AuditableEntity;
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
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(
		name = "room",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_room_site_code", columnNames = {"site_id", "code"})
		}
)
public class Room extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "site_id", nullable = false)
	private Site site;

	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@Column(name = "name", nullable = false, length = 120)
	private String name;

	@Column(name = "capacity", nullable = false)
	private Integer capacity;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private RoomStatus status;

	protected Room() {
	}

	public Room(Site site, String code, String name, Integer capacity, RoomStatus status) {
		this.site = site;
		this.code = code;
		this.name = name;
		this.capacity = capacity;
		this.status = status;
	}

	public UUID getId() {
		return id;
	}

	public Site getSite() {
		return site;
	}

	public String getCode() {
		return code;
	}

	public String getName() {
		return name;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public RoomStatus getStatus() {
		return status;
	}
}
