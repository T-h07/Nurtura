package com.nurtura.platform.modules.core.site.repository;

import com.nurtura.platform.modules.core.site.domain.Site;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, UUID> {

	List<Site> findAllByOrganizationIdInOrderByNameAsc(Collection<UUID> organizationIds);
}
