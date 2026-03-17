package com.nurtura.platform.modules.management.children.service;

import com.nurtura.platform.modules.core.guardian.domain.Guardian;
import com.nurtura.platform.modules.core.guardian.repository.GuardianRepository;
import com.nurtura.platform.modules.management.children.dto.GuardianSummaryResponse;
import com.nurtura.platform.modules.management.children.dto.GuardianUpsertRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ManagementGuardianService {

	private final GuardianRepository guardianRepository;

	public ManagementGuardianService(GuardianRepository guardianRepository) {
		this.guardianRepository = guardianRepository;
	}

	@Transactional(readOnly = true)
	public List<GuardianSummaryResponse> listGuardians() {
		return guardianRepository.findAllByOrderByLastNameAscFirstNameAsc().stream()
				.map(this::toGuardianSummaryResponse)
				.toList();
	}

	public GuardianSummaryResponse createGuardian(GuardianUpsertRequest request) {
		Guardian guardian = new Guardian(
				normalizeRequiredText(request.firstName()),
				normalizeRequiredText(request.lastName()),
				normalizeRequiredText(request.phoneNumber()),
				normalizeRequiredText(request.email()),
				request.status()
		);

		Guardian savedGuardian = guardianRepository.save(guardian);
		return toGuardianSummaryResponse(savedGuardian);
	}

	public GuardianSummaryResponse updateGuardian(UUID guardianId, GuardianUpsertRequest request) {
		Guardian guardian = findGuardianOrThrow(guardianId);
		guardian.updateProfile(
				normalizeRequiredText(request.firstName()),
				normalizeRequiredText(request.lastName()),
				normalizeRequiredText(request.phoneNumber()),
				normalizeRequiredText(request.email()),
				request.status()
		);

		return toGuardianSummaryResponse(guardian);
	}

	@Transactional(readOnly = true)
	public Guardian findGuardianOrThrow(UUID guardianId) {
		return guardianRepository.findById(guardianId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guardian does not exist."));
	}

	private GuardianSummaryResponse toGuardianSummaryResponse(Guardian guardian) {
		return new GuardianSummaryResponse(
				guardian.getId(),
				guardian.getFirstName(),
				guardian.getLastName(),
				guardian.getPhoneNumber(),
				guardian.getEmail(),
				guardian.getStatus().name()
		);
	}

	private String normalizeRequiredText(String value) {
		return value.trim();
	}
}
