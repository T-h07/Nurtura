package com.nurtura.platform.modules.management.children.service;

import com.nurtura.platform.modules.core.child.domain.Child;
import com.nurtura.platform.modules.core.child.repository.ChildRepository;
import com.nurtura.platform.modules.core.childguardian.domain.ChildGuardianLink;
import com.nurtura.platform.modules.core.childguardian.repository.ChildGuardianLinkRepository;
import com.nurtura.platform.modules.core.guardian.domain.Guardian;
import com.nurtura.platform.modules.core.guardian.repository.GuardianRepository;
import com.nurtura.platform.modules.core.organization.domain.Organization;
import com.nurtura.platform.modules.core.organization.repository.OrganizationRepository;
import com.nurtura.platform.modules.core.room.domain.Room;
import com.nurtura.platform.modules.core.room.repository.RoomRepository;
import com.nurtura.platform.modules.core.site.domain.Site;
import com.nurtura.platform.modules.core.site.repository.SiteRepository;
import com.nurtura.platform.modules.management.children.dto.ChildDetailsResponse;
import com.nurtura.platform.modules.management.children.dto.ChildGuardianContactResponse;
import com.nurtura.platform.modules.management.children.dto.ChildGuardianLinkUpsertRequest;
import com.nurtura.platform.modules.management.children.dto.ChildSummaryResponse;
import com.nurtura.platform.modules.management.children.dto.ChildUpsertRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ManagementChildService {

	private final ChildRepository childRepository;
	private final OrganizationRepository organizationRepository;
	private final SiteRepository siteRepository;
	private final RoomRepository roomRepository;
	private final GuardianRepository guardianRepository;
	private final ChildGuardianLinkRepository childGuardianLinkRepository;

	public ManagementChildService(
			ChildRepository childRepository,
			OrganizationRepository organizationRepository,
			SiteRepository siteRepository,
			RoomRepository roomRepository,
			GuardianRepository guardianRepository,
			ChildGuardianLinkRepository childGuardianLinkRepository
	) {
		this.childRepository = childRepository;
		this.organizationRepository = organizationRepository;
		this.siteRepository = siteRepository;
		this.roomRepository = roomRepository;
		this.guardianRepository = guardianRepository;
		this.childGuardianLinkRepository = childGuardianLinkRepository;
	}

	@Transactional(readOnly = true)
	public List<ChildSummaryResponse> listChildren() {
		return childRepository.findAllByOrderByLastNameAscFirstNameAsc().stream()
				.map(this::toChildSummaryResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public ChildDetailsResponse getChildDetails(UUID childId) {
		Child child = findChildOrThrow(childId);
		return toChildDetailsResponse(child);
	}

	public ChildDetailsResponse createChild(ChildUpsertRequest request) {
		ChildPlacement placement = resolvePlacement(request.organizationId(), request.siteId(), request.roomId());

		Child child = new Child(
				placement.organization(),
				placement.site(),
				placement.room(),
				normalizeRequiredText(request.firstName()),
				normalizeRequiredText(request.lastName()),
				normalizeOptionalText(request.preferredName()),
				request.dateOfBirth(),
				request.status(),
				normalizeOptionalText(request.notes())
		);

		Child savedChild = childRepository.save(child);
		return toChildDetailsResponse(savedChild);
	}

	public ChildDetailsResponse updateChild(UUID childId, ChildUpsertRequest request) {
		Child child = findChildOrThrow(childId);
		ChildPlacement placement = resolvePlacement(request.organizationId(), request.siteId(), request.roomId());

		child.updateProfile(
				placement.organization(),
				placement.site(),
				placement.room(),
				normalizeRequiredText(request.firstName()),
				normalizeRequiredText(request.lastName()),
				normalizeOptionalText(request.preferredName()),
				request.dateOfBirth(),
				request.status(),
				normalizeOptionalText(request.notes())
		);

		return toChildDetailsResponse(child);
	}

	@Transactional(readOnly = true)
	public List<ChildGuardianContactResponse> listGuardiansForChild(UUID childId) {
		findChildOrThrow(childId);
		return childGuardianLinkRepository
				.findAllByChildIdOrderByPrimaryContactDescGuardianLastNameAscGuardianFirstNameAsc(childId)
				.stream()
				.map(this::toChildGuardianContactResponse)
				.toList();
	}

	public ChildGuardianContactResponse linkGuardianToChild(
			UUID childId,
			UUID guardianId,
			ChildGuardianLinkUpsertRequest request
	) {
		Child child = findChildOrThrow(childId);
		Guardian guardian = findGuardianOrThrow(guardianId);
		String relationshipToChild = normalizeRequiredText(request.relationshipToChild());

		ChildGuardianLink childGuardianLink = childGuardianLinkRepository.findByChildIdAndGuardianId(childId, guardianId)
				.map(existingLink -> {
					existingLink.updateLink(
							relationshipToChild,
							request.primaryContact(),
							request.emergencyContact(),
							request.status()
					);
					return existingLink;
				})
				.orElseGet(() -> new ChildGuardianLink(
						child,
						guardian,
						relationshipToChild,
						request.primaryContact(),
						request.emergencyContact(),
						request.status()
				));

		ChildGuardianLink savedLink = childGuardianLinkRepository.save(childGuardianLink);
		clearPrimaryContactOnOtherLinks(savedLink);
		return toChildGuardianContactResponse(savedLink);
	}

	private void clearPrimaryContactOnOtherLinks(ChildGuardianLink currentLink) {
		if (!currentLink.isPrimaryContact()) {
			return;
		}

		List<ChildGuardianLink> siblingLinks = childGuardianLinkRepository.findAllByChildIdAndIdNot(
				currentLink.getChild().getId(),
				currentLink.getId()
		);

		siblingLinks.forEach(link -> link.setPrimaryContact(false));
	}

	private Child findChildOrThrow(UUID childId) {
		return childRepository.findById(childId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Child does not exist."));
	}

	private Guardian findGuardianOrThrow(UUID guardianId) {
		return guardianRepository.findById(guardianId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guardian does not exist."));
	}

	private ChildPlacement resolvePlacement(UUID organizationId, UUID siteId, UUID roomId) {
		Organization organization = organizationRepository.findById(organizationId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization does not exist."));

		Site site = siteRepository.findById(siteId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Site does not exist."));

		if (!site.getOrganization().getId().equals(organization.getId())) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Site must belong to the selected organization."
			);
		}

		Room room = null;
		if (roomId != null) {
			room = roomRepository.findById(roomId)
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room does not exist."));
			if (!room.getSite().getId().equals(site.getId())) {
				throw new ResponseStatusException(
						HttpStatus.BAD_REQUEST,
						"Room must belong to the selected site."
				);
			}
		}

		return new ChildPlacement(organization, site, room);
	}

	private ChildSummaryResponse toChildSummaryResponse(Child child) {
		return new ChildSummaryResponse(
				child.getId(),
				child.getFirstName(),
				child.getLastName(),
				child.getPreferredName(),
				child.getDateOfBirth(),
				child.getStatus().name(),
				child.getOrganization().getId(),
				child.getOrganization().getDisplayName(),
				child.getSite().getId(),
				child.getSite().getName(),
				child.getRoom() != null ? child.getRoom().getId() : null,
				child.getRoom() != null ? child.getRoom().getName() : null
		);
	}

	private ChildDetailsResponse toChildDetailsResponse(Child child) {
		return new ChildDetailsResponse(
				child.getId(),
				child.getFirstName(),
				child.getLastName(),
				child.getPreferredName(),
				child.getDateOfBirth(),
				child.getStatus().name(),
				child.getNotes(),
				child.getOrganization().getId(),
				child.getOrganization().getDisplayName(),
				child.getSite().getId(),
				child.getSite().getName(),
				child.getRoom() != null ? child.getRoom().getId() : null,
				child.getRoom() != null ? child.getRoom().getName() : null
		);
	}

	private ChildGuardianContactResponse toChildGuardianContactResponse(ChildGuardianLink link) {
		Guardian guardian = link.getGuardian();
		return new ChildGuardianContactResponse(
				link.getChild().getId(),
				guardian.getId(),
				guardian.getFirstName(),
				guardian.getLastName(),
				link.getRelationshipToChild(),
				link.isPrimaryContact(),
				link.isEmergencyContact(),
				link.getStatus().name(),
				guardian.getStatus().name(),
				guardian.getPhoneNumber(),
				guardian.getEmail()
		);
	}

	private String normalizeRequiredText(String value) {
		return value.trim();
	}

	private String normalizeOptionalText(String value) {
		if (value == null) {
			return null;
		}

		String trimmedValue = value.trim();
		return trimmedValue.isEmpty() ? null : trimmedValue;
	}

	private record ChildPlacement(
			Organization organization,
			Site site,
			Room room
	) {
	}
}
