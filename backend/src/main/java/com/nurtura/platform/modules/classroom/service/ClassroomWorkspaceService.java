package com.nurtura.platform.modules.classroom.service;

import com.nurtura.platform.modules.classroom.dto.ClassroomWorkspaceSummaryResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClassroomWorkspaceService {

	public ClassroomWorkspaceSummaryResponse getWorkspaceSummary() {
		return new ClassroomWorkspaceSummaryResponse(
				"Teacher and classroom workspace",
				"TEACHER, PLATFORM_ADMIN",
				"Optimized for fast daily classroom routines with clear role boundaries.",
				List.of(
						"Attendance and classroom status",
						"Daily rhythm, notes, and parent-safe communications",
						"Low-friction interaction design for active classroom use"
				),
				List.of(
						"Record attendance",
						"Open the daily classroom board",
						"Prepare handoff updates for guardians"
				)
		);
	}
}
