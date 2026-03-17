package com.nurtura.platform.modules.management.children.web;

import com.nurtura.platform.modules.management.children.dto.ChildDetailsResponse;
import com.nurtura.platform.modules.management.children.dto.ChildGuardianContactResponse;
import com.nurtura.platform.modules.management.children.dto.ChildGuardianLinkUpsertRequest;
import com.nurtura.platform.modules.management.children.dto.ChildSummaryResponse;
import com.nurtura.platform.modules.management.children.dto.ChildUpsertRequest;
import com.nurtura.platform.modules.management.children.service.ManagementChildService;
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
@RequestMapping("/api/management/children")
public class ManagementChildController {

	private final ManagementChildService managementChildService;

	public ManagementChildController(ManagementChildService managementChildService) {
		this.managementChildService = managementChildService;
	}

	@GetMapping
	public List<ChildSummaryResponse> listChildren() {
		return managementChildService.listChildren();
	}

	@GetMapping("/{childId}")
	public ChildDetailsResponse getChildDetails(@PathVariable UUID childId) {
		return managementChildService.getChildDetails(childId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ChildDetailsResponse createChild(@Valid @RequestBody ChildUpsertRequest request) {
		return managementChildService.createChild(request);
	}

	@PutMapping("/{childId}")
	public ChildDetailsResponse updateChild(@PathVariable UUID childId, @Valid @RequestBody ChildUpsertRequest request) {
		return managementChildService.updateChild(childId, request);
	}

	@GetMapping("/{childId}/guardians")
	public List<ChildGuardianContactResponse> listGuardiansForChild(@PathVariable UUID childId) {
		return managementChildService.listGuardiansForChild(childId);
	}

	@PutMapping("/{childId}/guardians/{guardianId}")
	public ChildGuardianContactResponse linkGuardianToChild(
			@PathVariable UUID childId,
			@PathVariable UUID guardianId,
			@Valid @RequestBody ChildGuardianLinkUpsertRequest request
	) {
		return managementChildService.linkGuardianToChild(childId, guardianId, request);
	}
}
