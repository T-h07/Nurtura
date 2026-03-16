package com.nurtura.platform.modules.management.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.nurtura.platform.modules.management.dto.ManagementWorkspaceSummaryResponse;
import org.junit.jupiter.api.Test;

class ManagementWorkspaceServiceTest {

	@Test
	void returnsManagementWorkspaceSummary() {
		ManagementWorkspaceService service = new ManagementWorkspaceService();

		ManagementWorkspaceSummaryResponse response = service.getWorkspaceSummary();

		assertThat(response.roleScope()).contains("MANAGEMENT");
		assertThat(response.focusAreas()).isNotEmpty();
		assertThat(response.quickActions()).isNotEmpty();
	}
}
