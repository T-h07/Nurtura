package com.nurtura.platform.security;

public enum ApplicationRole {
	PLATFORM_ADMIN("Platform Admin"),
	MANAGEMENT("Management"),
	TEACHER("Teacher"),
	PARENT("Parent");

	private final String displayName;

	ApplicationRole(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}
}
