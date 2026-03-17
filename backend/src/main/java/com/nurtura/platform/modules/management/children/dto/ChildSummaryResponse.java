package com.nurtura.platform.modules.management.children.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ChildSummaryResponse(
		UUID id,
		String firstName,
		String lastName,
		String preferredName,
		LocalDate dateOfBirth,
		String status,
		UUID organizationId,
		String organizationName,
		UUID siteId,
		String siteName,
		UUID roomId,
		String roomName
) {
}
