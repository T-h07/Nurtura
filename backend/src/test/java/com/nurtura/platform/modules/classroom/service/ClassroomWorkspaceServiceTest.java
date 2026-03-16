package com.nurtura.platform.modules.classroom.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.nurtura.platform.modules.classroom.dto.ClassroomWorkspaceSummaryResponse;
import org.junit.jupiter.api.Test;

class ClassroomWorkspaceServiceTest {

	@Test
	void returnsTeacherWorkspaceSummary() {
		ClassroomWorkspaceService service = new ClassroomWorkspaceService();

		ClassroomWorkspaceSummaryResponse response = service.getWorkspaceSummary();

		assertThat(response.roleScope()).contains("TEACHER");
		assertThat(response.focusAreas()).isNotEmpty();
		assertThat(response.quickActions()).isNotEmpty();
	}
}
