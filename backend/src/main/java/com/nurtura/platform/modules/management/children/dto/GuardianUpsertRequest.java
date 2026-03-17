package com.nurtura.platform.modules.management.children.dto;

import com.nurtura.platform.modules.core.guardian.domain.GuardianStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GuardianUpsertRequest(
		@NotBlank @Size(max = 100) String firstName,
		@NotBlank @Size(max = 100) String lastName,
		@NotBlank @Size(max = 40) String phoneNumber,
		@NotBlank @Email @Size(max = 255) String email,
		@NotNull GuardianStatus status
) {
}
