package com.nurtura.platform.common.api;

import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicHealthController {

	@GetMapping("/api/public/health")
	public PublicHealthResponse health() {
		return new PublicHealthResponse("nurtura-backend", "healthy", Instant.now());
	}

	public record PublicHealthResponse(String application, String status, Instant timestamp) {
	}
}
