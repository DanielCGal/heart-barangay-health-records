package HEART.example.HEART.Controllers.Service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static class OtpEntry {
        String code;
        Instant expiresAt;

        OtpEntry(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, OtpEntry> store = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private String key(String purpose, String email) {
        return purpose + ":" + email.toLowerCase().trim();
    }

    public String generateAndStore(String purpose, String email, int minutesValid) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        store.put(key(purpose, email), new OtpEntry(code, Instant.now().plusSeconds(minutesValid * 60L)));
        return code;
    }

    public boolean verify(String purpose, String email, String code) {
        String k = key(purpose, email);
        OtpEntry entry = store.get(k);
        if (entry == null) return false;

        if (Instant.now().isAfter(entry.expiresAt)) {
            store.remove(k);
            return false;
        }

        boolean ok = entry.code.equals(code);
        if (ok) store.remove(k); // one-time use
        return ok;
    }
}