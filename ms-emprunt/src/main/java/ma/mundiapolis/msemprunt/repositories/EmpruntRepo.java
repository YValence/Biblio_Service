package ma.mundiapolis.msemprunt.repositories;

import ma.mundiapolis.msemprunt.entities.Emprunt;
import ma.mundiapolis.msemprunt.enums.StatutEmprunt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface EmpruntRepo extends JpaRepository<Emprunt, Long> {

    // Trouver tous les emprunts d'un utilisateur
    List<Emprunt> findByUtilisateurId(Long utilisateurId);

    // Trouver tous les emprunts d'un livre
    List<Emprunt> findByLivreId(Long livreId);

    // Trouver les emprunts par statut
    List<Emprunt> findByStatut(StatutEmprunt statut);

    // Vérifier si un utilisateur a déjà emprunté un livre (et ne l'a pas encore retourné)
    Optional<Emprunt> findByUtilisateurIdAndLivreIdAndStatut(Long utilisateurId, Long livreId, StatutEmprunt statut);

    // Trouver les emprunts en retard (date de retour prévue dépassée et statut EN_COURS)
    List<Emprunt> findByDateRetourPrevueBeforeAndStatut(LocalDateTime date, StatutEmprunt statut);

    // Trouver les emprunts en cours d'un utilisateur
    List<Emprunt> findByUtilisateurIdAndStatut(Long utilisateurId, StatutEmprunt statut);


}
