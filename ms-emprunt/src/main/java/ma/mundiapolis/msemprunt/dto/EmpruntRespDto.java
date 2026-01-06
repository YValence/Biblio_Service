package ma.mundiapolis.msemprunt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.mundiapolis.msemprunt.enums.StatutEmprunt;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmpruntRespDto {

    private Long id;
    private Long utilisateurId;
    private Long livreId;
    private LocalDateTime dateEmprunt;
    private LocalDateTime dateRetourPrevue;
    private LocalDateTime dateRetourEffective;
    private StatutEmprunt statut;

    // Informations enrichies depuis les autres microservices
    private UserDto utilisateur;
    private LivreDto livre;
}
