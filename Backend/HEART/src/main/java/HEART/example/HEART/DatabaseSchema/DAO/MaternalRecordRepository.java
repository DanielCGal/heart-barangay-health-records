package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.MaternalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaternalRecordRepository extends JpaRepository<MaternalRecord, Long> {}