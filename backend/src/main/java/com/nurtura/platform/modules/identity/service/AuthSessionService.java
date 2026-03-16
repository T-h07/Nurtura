package com.nurtura.platform.modules.identity.service;

import com.nurtura.platform.modules.identity.dto.AuthSessionResponse;
import com.nurtura.platform.security.ApplicationRole;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthSessionService {

	private static final String ROLE_PREFIX = "ROLE_";
	private static final Set<String> SUPPORTED_ROLE_CODES = Arrays.stream(ApplicationRole.values())
			.map(Enum::name)
			.collect(Collectors.toUnmodifiableSet());

	public AuthSessionResponse buildSession(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()
				|| authentication instanceof AnonymousAuthenticationToken) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required");
		}

		var roles = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.filter(authority -> authority.startsWith(ROLE_PREFIX))
				.map(authority -> authority.substring(ROLE_PREFIX.length()))
				.filter(SUPPORTED_ROLE_CODES::contains)
				.distinct()
				.sorted()
				.toList();

		return new AuthSessionResponse(authentication.getName(), roles);
	}
}
