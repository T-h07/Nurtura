package com.nurtura.platform.modules.core.child.repository;

import com.nurtura.platform.modules.core.child.domain.Child;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRepository extends JpaRepository<Child, UUID> {

	@EntityGraph(attributePaths = {"organization", "site", "room"})
	List<Child> findAllByOrderByLastNameAscFirstNameAsc();

	@Override
	@EntityGraph(attributePaths = {"organization", "site", "room"})
	Optional<Child> findById(UUID id);
}
