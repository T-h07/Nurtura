package com.nurtura.platform.modules.management.service;

import com.nurtura.platform.modules.management.dto.ManagementWorkspaceSummaryResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ManagementWorkspaceService {

	public ManagementWorkspaceSummaryResponse getWorkspaceSummary() {
		return new ManagementWorkspaceSummaryResponse(
				"Management and admin workspace",
				"MANAGEMENT, PLATFORM_ADMIN",
				"Focused on structured oversight, staffing context, and operational readiness.",
				List.of(
						"Enrollment and account administration",
						"Classroom roster visibility and staffing balance",
						"Operational reporting with clear audit trails"
				),
				List.of(
						"Review site readiness",
						"Open enrollment pipeline",
						"Inspect staff and classroom coverage"
				)
		);
	}
}
