package com.nurtura.platform.modules.management.children.dto;

import java.util.UUID;

public record GuardianSummaryResponse(
		UUID id,
		String firstName,
		String lastName,
		String phoneNumber,
		String email,
		String status
) {
}
