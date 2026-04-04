package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.LogbookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogbookEntryRepository extends JpaRepository<LogbookEntry, Long> {
    List<LogbookEntry> findAllByOrderByTimestampDesc();
}