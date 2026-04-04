package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.PersonalSocialHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalSocialHistoryRepository extends JpaRepository<PersonalSocialHistory, Long> {}
