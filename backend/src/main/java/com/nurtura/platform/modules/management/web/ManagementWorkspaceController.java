package com.nurtura.platform.modules.management.web;

import com.nurtura.platform.modules.management.dto.ManagementWorkspaceSummaryResponse;
import com.nurtura.platform.modules.management.service.ManagementWorkspaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ManagementWorkspaceController {

	private final ManagementWorkspaceService managementWorkspaceService;

	public ManagementWorkspaceController(ManagementWorkspaceService managementWorkspaceService) {
		this.managementWorkspaceService = managementWorkspaceService;
	}

	@GetMapping("/api/management/workspace")
	public ManagementWorkspaceSummaryResponse getWorkspaceSummary() {
		return managementWorkspaceService.getWorkspaceSummary();
	}
}
