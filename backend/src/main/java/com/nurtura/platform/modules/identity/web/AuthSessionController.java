package com.nurtura.platform.modules.identity.web;

import com.nurtura.platform.modules.identity.dto.AuthSessionResponse;
import com.nurtura.platform.modules.identity.service.AuthSessionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthSessionController {

	private final AuthSessionService authSessionService;

	public AuthSessionController(AuthSessionService authSessionService) {
		this.authSessionService = authSessionService;
	}

	@GetMapping("/api/auth/me")
	public AuthSessionResponse getCurrentSession(Authentication authentication) {
		return authSessionService.buildSession(authentication);
	}
}
