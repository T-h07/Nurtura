package com.nurtura.platform.modules.management.children.web;

import com.nurtura.platform.modules.management.children.dto.GuardianSummaryResponse;
import com.nurtura.platform.modules.management.children.dto.GuardianUpsertRequest;
import com.nurtura.platform.modules.management.children.service.ManagementGuardianService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/management/guardians")
public class ManagementGuardianController {

	private final ManagementGuardianService managementGuardianService;

	public ManagementGuardianController(ManagementGuardianService managementGuardianService) {
		this.managementGuardianService = managementGuardianService;
	}

	@GetMapping
	public List<GuardianSummaryResponse> listGuardians() {
		return managementGuardianService.listGuardians();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public GuardianSummaryResponse createGuardian(@Valid @RequestBody GuardianUpsertRequest request) {
		return managementGuardianService.createGuardian(request);
	}

	@PutMapping("/{guardianId}")
	public GuardianSummaryResponse updateGuardian(
			@PathVariable UUID guardianId,
			@Valid @RequestBody GuardianUpsertRequest request
	) {
		return managementGuardianService.updateGuardian(guardianId, request);
	}
}
