package com.nurtura.platform.modules.classroom.dto;

import java.util.List;

public record ClassroomWorkspaceSummaryResponse(
		String title,
		String roleScope,
		String summary,
		List<String> focusAreas,
		List<String> quickActions
) {
}
