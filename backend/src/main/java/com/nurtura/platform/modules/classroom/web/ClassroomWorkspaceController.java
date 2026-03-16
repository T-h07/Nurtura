package com.nurtura.platform.modules.classroom.web;

import com.nurtura.platform.modules.classroom.dto.ClassroomWorkspaceSummaryResponse;
import com.nurtura.platform.modules.classroom.service.ClassroomWorkspaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClassroomWorkspaceController {

	private final ClassroomWorkspaceService classroomWorkspaceService;

	public ClassroomWorkspaceController(ClassroomWorkspaceService classroomWorkspaceService) {
		this.classroomWorkspaceService = classroomWorkspaceService;
	}

	@GetMapping("/api/classroom/workspace")
	public ClassroomWorkspaceSummaryResponse getWorkspaceSummary() {
		return classroomWorkspaceService.getWorkspaceSummary();
	}
}
