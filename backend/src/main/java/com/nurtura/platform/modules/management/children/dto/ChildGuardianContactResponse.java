package com.nurtura.platform.modules.management.children.dto;

import java.util.UUID;

public record ChildGuardianContactResponse(
		UUID childId,
		UUID guardianId,
		String firstName,
		String lastName,
		String relationshipToChild,
		boolean primaryContact,
		boolean emergencyContact,
		String relationshipStatus,
		String guardianStatus,
		String phoneNumber,
		String email
) {
}
