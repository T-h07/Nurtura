package com.nurtura.platform.modules.core.childguardian.repository;

import com.nurtura.platform.modules.core.childguardian.domain.ChildGuardianLink;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildGuardianLinkRepository extends JpaRepository<ChildGuardianLink, UUID> {

	@EntityGraph(attributePaths = {"guardian"})
	List<ChildGuardianLink> findAllByChildIdOrderByPrimaryContactDescGuardianLastNameAscGuardianFirstNameAsc(UUID childId);

	Optional<ChildGuardianLink> findByChildIdAndGuardianId(UUID childId, UUID guardianId);

	List<ChildGuardianLink> findAllByChildIdAndIdNot(UUID childId, UUID excludedId);
}
