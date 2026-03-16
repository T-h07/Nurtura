package com.nurtura.platform.modules.core.organization.repository;

import com.nurtura.platform.modules.core.organization.domain.Organization;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

	List<Organization> findAllByOrderByDisplayNameAsc();
}
