package com.nurtura.platform.modules.management.service;

import com.nurtura.platform.modules.core.organization.domain.Organization;
import com.nurtura.platform.modules.core.organization.repository.OrganizationRepository;
import com.nurtura.platform.modules.core.room.domain.Room;
import com.nurtura.platform.modules.core.room.repository.RoomRepository;
import com.nurtura.platform.modules.core.site.domain.Site;
import com.nurtura.platform.modules.core.site.repository.SiteRepository;
import com.nurtura.platform.modules.core.staff.domain.StaffMember;
import com.nurtura.platform.modules.core.staff.repository.StaffMemberRepository;
import com.nurtura.platform.modules.identity.domain.UserAccount;
import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse;
import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse.OrganizationContext;
import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse.RoomContext;
import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse.SiteContext;
import com.nurtura.platform.modules.management.dto.ManagementOperationalContextResponse.StaffMemberContext;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ManagementOperationalContextService {

	private final OrganizationRepository organizationRepository;
	private final SiteRepository siteRepository;
	private final RoomRepository roomRepository;
	private final StaffMemberRepository staffMemberRepository;

	public ManagementOperationalContextService(
			OrganizationRepository organizationRepository,
			SiteRepository siteRepository,
			RoomRepository roomRepository,
			StaffMemberRepository staffMemberRepository
	) {
		this.organizationRepository = organizationRepository;
		this.siteRepository = siteRepository;
		this.roomRepository = roomRepository;
		this.staffMemberRepository = staffMemberRepository;
	}

	public ManagementOperationalContextResponse getOperationalContext() {
		List<Organization> organizations = organizationRepository.findAllByOrderByDisplayNameAsc();
		if (organizations.isEmpty()) {
			return new ManagementOperationalContextResponse(List.of());
		}

		List<UUID> organizationIds = organizations.stream()
				.map(Organization::getId)
				.toList();

		List<Site> sites = siteRepository.findAllByOrganizationIdInOrderByNameAsc(organizationIds);
		List<UUID> siteIds = sites.stream().map(Site::getId).toList();

		List<Room> rooms = siteIds.isEmpty()
				? List.of()
				: roomRepository.findAllBySiteIdInOrderByNameAsc(siteIds);

		List<StaffMember> staffMembers = staffMemberRepository
				.findAllByOrganizationIdInOrderByLastNameAscFirstNameAsc(organizationIds);

		Map<UUID, Site> siteById = toSiteByIdMap(sites);
		Map<UUID, Room> roomById = toRoomByIdMap(rooms);
		Map<UUID, List<Site>> sitesByOrganizationId = sites.stream()
				.collect(Collectors.groupingBy(site -> site.getOrganization().getId(), LinkedHashMap::new, Collectors.toList()));
		Map<UUID, List<Room>> roomsBySiteId = rooms.stream()
				.collect(Collectors.groupingBy(room -> room.getSite().getId(), LinkedHashMap::new, Collectors.toList()));
		Map<UUID, List<StaffMember>> staffByOrganizationId = staffMembers.stream()
				.collect(Collectors.groupingBy(staffMember -> staffMember.getOrganization().getId(), LinkedHashMap::new, Collectors.toList()));
		Map<UUID, Long> staffCountBySiteId = staffMembers.stream()
				.collect(Collectors.groupingBy(staffMember -> staffMember.getSite().getId(), Collectors.counting()));
		Map<UUID, Long> staffCountByRoomId = staffMembers.stream()
				.filter(staffMember -> staffMember.getRoom() != null)
				.collect(Collectors.groupingBy(staffMember -> staffMember.getRoom().getId(), Collectors.counting()));

		List<OrganizationContext> organizationContexts = organizations.stream()
				.map(organization -> toOrganizationContext(
						organization,
						sitesByOrganizationId.getOrDefault(organization.getId(), List.of()),
						roomsBySiteId,
						staffCountBySiteId,
						staffCountByRoomId,
						staffByOrganizationId.getOrDefault(organization.getId(), List.of()),
						siteById,
						roomById
				))
				.toList();

		return new ManagementOperationalContextResponse(organizationContexts);
	}

	private OrganizationContext toOrganizationContext(
			Organization organization,
			List<Site> organizationSites,
			Map<UUID, List<Room>> roomsBySiteId,
			Map<UUID, Long> staffCountBySiteId,
			Map<UUID, Long> staffCountByRoomId,
			List<StaffMember> organizationStaff,
			Map<UUID, Site> siteById,
			Map<UUID, Room> roomById
	) {
		List<SiteContext> siteContexts = organizationSites.stream()
				.map(site -> new SiteContext(
						site.getId(),
						site.getCode(),
						site.getName(),
						site.getTimezone(),
						site.getStatus().name(),
						Math.toIntExact(staffCountBySiteId.getOrDefault(site.getId(), 0L)),
						roomsBySiteId.getOrDefault(site.getId(), List.of()).stream()
								.map(room -> new RoomContext(
										room.getId(),
										room.getCode(),
										room.getName(),
										room.getCapacity(),
										room.getStatus().name(),
										Math.toIntExact(staffCountByRoomId.getOrDefault(room.getId(), 0L))
								))
								.toList()
				))
				.toList();

		List<StaffMemberContext> staffContexts = organizationStaff.stream()
				.map(staffMember -> toStaffMemberContext(staffMember, siteById, roomById))
				.toList();

		return new OrganizationContext(
				organization.getId(),
				organization.getCode(),
				organization.getDisplayName(),
				organization.getLegalName(),
				organization.getStatus().name(),
				siteContexts,
				staffContexts
		);
	}

	private StaffMemberContext toStaffMemberContext(
			StaffMember staffMember,
			Map<UUID, Site> siteById,
			Map<UUID, Room> roomById
	) {
		UUID siteId = staffMember.getSite().getId();
		Site site = siteById.get(siteId);

		Room staffRoom = staffMember.getRoom();
		UUID roomId = staffRoom != null ? staffRoom.getId() : null;
		Room room = roomId != null ? roomById.get(roomId) : null;

		UserAccount userAccount = staffMember.getUserAccount();

		return new StaffMemberContext(
				staffMember.getId(),
				staffMember.getStaffCode(),
				staffMember.getFirstName(),
				staffMember.getLastName(),
				staffMember.getJobTitle(),
				staffMember.getEmploymentStatus().name(),
				siteId,
				site != null ? site.getName() : null,
				roomId,
				room != null ? room.getName() : null,
				userAccount != null ? userAccount.getId() : null,
				userAccount != null ? userAccount.getEmail() : null
		);
	}

	private Map<UUID, Site> toSiteByIdMap(Collection<Site> sites) {
		return sites.stream()
				.collect(Collectors.toMap(Site::getId, site -> site, (left, right) -> left, LinkedHashMap::new));
	}

	private Map<UUID, Room> toRoomByIdMap(Collection<Room> rooms) {
		return rooms.stream()
				.collect(Collectors.toMap(Room::getId, room -> room, (left, right) -> left, LinkedHashMap::new));
	}
}
