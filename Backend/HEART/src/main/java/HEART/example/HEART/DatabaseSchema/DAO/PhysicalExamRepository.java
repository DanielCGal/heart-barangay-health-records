package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.PhysicalExam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysicalExamRepository extends JpaRepository<PhysicalExam, Long> {}
