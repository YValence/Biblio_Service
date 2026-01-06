package ma.mundiapolis.mslivre.repositories;

import ma.mundiapolis.mslivre.entities.Livre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivreRepo extends JpaRepository<Livre, Long> {
}
