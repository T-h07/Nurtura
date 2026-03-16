package com.nurtura.platform.modules.management.web;

import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse;
import com.nurtura.platform.modules.management.dto.ManagementWorkspaceSummaryResponse;
import com.nurtura.platform.modules.management.service.ManagementOperationalContextService;
import com.nurtura.platform.modules.management.service.ManagementWorkspaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ManagementWorkspaceController {

	private final ManagementWorkspaceService managementWorkspaceService;
	private final ManagementOperationalContextService managementOperationalContextService;

	public ManagementWorkspaceController(
			ManagementWorkspaceService managementWorkspaceService,
			ManagementOperationalContextService managementOperationalContextService
	) {
		this.managementWorkspaceService = managementWorkspaceService;
		this.managementOperationalContextService = managementOperationalContextService;
	}

	@GetMapping("/api/management/workspace")
	public ManagementWorkspaceSummaryResponse getWorkspaceSummary() {
		return managementWorkspaceService.getWorkspaceSummary();
	}

	@GetMapping("/api/management/operational-context")
	public ManagementOperationalContextResponse getOperationalContext() {
		return managementOperationalContextService.getOperationalContext();
	}
}
