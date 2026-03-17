package com.nurtura.platform.modules.management.children.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ChildDetailsResponse(
		UUID id,
		String firstName,
		String lastName,
		String preferredName,
		LocalDate dateOfBirth,
		String status,
		String notes,
		UUID organizationId,
		String organizationName,
		UUID siteId,
		String siteName,
		UUID roomId,
		String roomName
) {
}
