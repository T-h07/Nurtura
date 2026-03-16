package com.nurtura.platform.modules.core.room.repository;

import com.nurtura.platform.modules.core.room.domain.Room;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, UUID> {

	List<Room> findAllBySiteIdInOrderByNameAsc(Collection<UUID> siteIds);
}
