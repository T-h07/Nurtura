package com.nurtura.platform.modules.management.dto;

import java.util.List;

public record ManagementWorkspaceSummaryResponse(
		String title,
		String roleScope,
		String summary,
		List<String> focusAreas,
		List<String> quickActions
) {
}
