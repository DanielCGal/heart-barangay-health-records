package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.StaffAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StaffAccountRepository extends JpaRepository<StaffAccount, UUID> {
    Optional<StaffAccount> findByUsername(String username);
    Optional<StaffAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsername(String username);
    
}
