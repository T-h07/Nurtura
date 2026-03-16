package com.nurtura.platform.modules.core.staff.repository;

import com.nurtura.platform.modules.core.staff.domain.StaffMember;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffMemberRepository extends JpaRepository<StaffMember, UUID> {

	List<StaffMember> findAllByOrganizationIdInOrderByLastNameAscFirstNameAsc(Collection<UUID> organizationIds);
}
