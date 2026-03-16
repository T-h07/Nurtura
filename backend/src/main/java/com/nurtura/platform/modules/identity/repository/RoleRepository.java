package com.nurtura.platform.modules.identity.repository;

import com.nurtura.platform.modules.identity.domain.Role;
import com.nurtura.platform.security.ApplicationRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByCode(ApplicationRole code);
}
