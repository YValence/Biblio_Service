package ma.mundiapolis.msusers.repositories;

import ma.mundiapolis.msusers.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // ✅ Méthode personnalisée pour trouver par email
    Optional<User> findByEmail(String email);

    // ✅ AJOUTER CETTE MÉTHODE : Vérifier si un email existe déjà
    boolean existsByEmail(String email);

    // Vérifie si un email existe pour un utilisateur différent de l'ID donné
    boolean existsByEmailAndIdNot(String email, Long id);
}
