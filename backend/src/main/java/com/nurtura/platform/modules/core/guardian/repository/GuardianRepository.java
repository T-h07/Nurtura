package com.nurtura.platform.modules.core.guardian.repository;

import com.nurtura.platform.modules.core.guardian.domain.Guardian;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuardianRepository extends JpaRepository<Guardian, UUID> {

	List<Guardian> findAllByOrderByLastNameAscFirstNameAsc();
}
