package com.nurtura.platform.modules.management.children.dto;

import com.nurtura.platform.modules.core.childguardian.domain.ChildGuardianLinkStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChildGuardianLinkUpsertRequest(
		@NotBlank @Size(max = 80) String relationshipToChild,
		boolean primaryContact,
		boolean emergencyContact,
		@NotNull ChildGuardianLinkStatus status
) {
}
