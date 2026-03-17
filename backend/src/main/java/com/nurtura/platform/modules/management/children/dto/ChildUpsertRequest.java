package com.nurtura.platform.modules.management.children.dto;

import com.nurtura.platform.modules.core.child.domain.ChildStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record ChildUpsertRequest(
		@NotBlank @Size(max = 100) String firstName,
		@NotBlank @Size(max = 100) String lastName,
		@Size(max = 100) String preferredName,
		@NotNull @PastOrPresent LocalDate dateOfBirth,
		@NotNull UUID organizationId,
		@NotNull UUID siteId,
		UUID roomId,
		@NotNull ChildStatus status,
		@Size(max = 1000) String notes
) {
}
