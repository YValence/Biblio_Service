package ma.mundiapolis.msemprunt.entities;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.mundiapolis.msemprunt.enums.StatutEmprunt;

import java.time.LocalDateTime;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Emprunt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long utilisateurId;  // Référence vers ms-users
    private Long livreId;         // Référence vers ms-livre

    private LocalDateTime dateEmprunt;
    private LocalDateTime dateRetourPrevue;
    private LocalDateTime dateRetourEffective;

    @Enumerated(EnumType.STRING)
    private StatutEmprunt statut;
}
