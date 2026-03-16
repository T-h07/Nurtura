package com.nurtura.platform.modules.management.dto;

import java.util.List;
import java.util.UUID;

public record ManagementOperationalContextResponse(
		List<OrganizationContext> organizations
) {

	public record OrganizationContext(
			UUID id,
			String code,
			String displayName,
			String legalName,
			String status,
			List<SiteContext> sites,
			List<StaffMemberContext> staffMembers
	) {
	}

	public record SiteContext(
			UUID id,
			String code,
			String name,
			String timezone,
			String status,
			int staffCount,
			List<RoomContext> rooms
	) {
	}

	public record RoomContext(
			UUID id,
			String code,
			String name,
			int capacity,
			String status,
			int assignedStaffCount
	) {
	}

	public record StaffMemberContext(
			UUID id,
			String staffCode,
			String firstName,
			String lastName,
			String jobTitle,
			String employmentStatus,
			UUID siteId,
			String siteName,
			UUID roomId,
			String roomName,
			UUID userAccountId,
			String userAccountEmail
	) {
	}
}
